import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { log } from "console";
// CSV parsing utility
function parseCSV(csvText: string): { families: any[]; errors: string[] } {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must contain at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const requiredHeaders = ["family_code", "family_name", "id_card_no", "phone", "sanda_amount", "arrears"]

  // Validate required headers
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
  }

  const families: any[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch`)
      continue
    }

    const family: any = {}
    headers.forEach((header, index) => {
      family[header] = values[index] || ""
    })

    // Validate required fields
    const rowErrors: string[] = []
    if (!family.family_code) rowErrors.push("Family code is required")
    if (!family.family_name) rowErrors.push("Family name is required")
    if (!family.id_card_no) rowErrors.push("ID card number is required")
    if (!family.phone) rowErrors.push("Phone is required")
    if (!family.sanda_amount) rowErrors.push("Sanda amount is required")

    if (rowErrors.length > 0) {
      errors.push(`Row ${i + 1}: ${rowErrors.join(", ")}`)
      continue
    }

    // Generate family ID
    family.family_code = family.family_code || `FAM${String(i).padStart(3, "0")}`;
    family.family_name = family.family_name || "N/A";
    family.id_card_no = family.id_card_no || "N/A";
    family.phone = family.phone || "N/A";
    family.sanda_amount = family.sanda_amount || "0";
    family.arrears = family.arrears || "0";

    families.push(family)
  }

  return { families, errors }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ success: false, error: "File must be a CSV" }, { status: 400 })
    }

    const csvText = await file.text()
    const { families, errors } = parseCSV(csvText)

    if (families.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid families found in CSV", validation_errors: errors },
        { status: 400 },
      )
    }

    if (families.length > 2500) {
      return NextResponse.json({ success: false, error: "Maximum 2,500 families allowed per import" }, { status: 400 })
    }

    // Read neon connection string from env
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database connection string not configured" }, { status: 500 });
    }

    const client = neon(connectionString);

    // Insert families in a transaction
    try {
      await client.query("BEGIN");

      const inserted: any[] = [];
      const duplicates: string[] = [];
      const rowErrors: { row: number; error: string }[] = [];

      for (let idx = 0; idx < families.length; idx++) {
        const f = families[idx];
        try{
        // adjust column names to your DB schema if needed
        const res = await client.query(
          `INSERT INTO families
            (family_code,family_name,id_card_no,phone,sanda_amount,arrears)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (family_code) DO NOTHING
           RETURNING family_code`,
          [
            f.family_code,
            f.family_name,
            f.id_card_no,
            f.phone,
            f.sanda_amount,
            f.arrears,
          ]
        );
        if (res && res.length > 0) {
          inserted.push(res[0]);
        } else {
          duplicates.push(f.family_code);
        }
        } catch (rowErr: any) {
          const msg =
            rowErr?.code === "23505"
              ? // try to extract key from detail like: Key (family_code)=(FAM001) already exists.
                (rowErr.detail?.match(/Key \(([^)]+)\)=\(([^)]+)\)/)?.[2] ??
                  rowErr.detail ??
                  "duplicate key")
              : rowErr?.message ?? String(rowErr);
          rowErrors.push({ row: idx + 2, error: msg }); // +2 for header and 0-based index
        }
      }

      await client.query("COMMIT");

      const importResult = {
        total_processed: families.length,
        successful_imports: inserted.length,
        duplicate_keys: duplicates,
        row_errors: rowErrors,
        validation_errors: errors.slice(0, 10),
        imported_families: inserted.slice(0, 5),
      };


      const messageParts = [
        `Processed ${importResult.total_processed}`,
        `${importResult.successful_imports} imported`,
        importResult.duplicate_keys.length ? `${importResult.duplicate_keys.length} duplicate(s)` : null,
        importResult.row_errors.length ? `${importResult.row_errors.length} error(s)` : null,
      ].filter(Boolean);
      const message = messageParts.join(", ");

      return NextResponse.json({
        success: true,
        data: importResult,
        message,
      });
    } catch (dbErr) {
      await client.query("ROLLBACK");
      console.error("DB import error:", dbErr);
      if ((dbErr as any)?.code === "23505") {
        const detail = (dbErr as any).detail || "";
        const dupMatch = detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        const dupKey = dupMatch ? dupMatch[2] : detail || "duplicate key";
        return NextResponse.json({ success: false, error: "Duplicate key error", duplicate: dupKey }, { status: 409 });
      }
      return NextResponse.json({ success: false, error: "Database error during import" }, { status: 500 });
    } finally {
      // attempt to close connection if supported
      try {
        if (typeof client.end === "function") await client.end();
      } catch (e) {
        // ignore
      }
    }
  } catch (error) {
    console.error("Error processing CSV import:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process CSV import" },
      { status: 500 },
    )
  }
}

export async function GET() {
  // Generate sample CSV template
  const sampleCSV = `family_code,family_name,id_card_no,phone,sanda_amount,arrears
FAM001,Abdul Rahman,1234567890,789299000,5000,200
FAM002,Mohammad Ahmed,1234567891,779799000,3000,150
FAM003,Ali Khan,1234567892,752222222,4500,300`

  return new NextResponse(sampleCSV, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="family-import-template.csv"',
    },
  })
}
