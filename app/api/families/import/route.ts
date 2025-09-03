import { type NextRequest, NextResponse } from "next/server"

// CSV parsing utility
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must contain at least a header row and one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const requiredHeaders = ["family_name", "head_of_family", "phone", "email", "address"]

  // Validate required headers
  const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
  }

  const families = []
  const errors = []

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
    const rowErrors = []
    if (!family.family_name) rowErrors.push("Family name is required")
    if (!family.head_of_family) rowErrors.push("Head of family is required")
    if (!family.phone) rowErrors.push("Phone is required")
    if (!family.email || !family.email.includes("@")) rowErrors.push("Valid email is required")

    if (rowErrors.length > 0) {
      errors.push(`Row ${i + 1}: ${rowErrors.join(", ")}`)
      continue
    }

    // Generate family ID
    family.family_id = `FAM${String(i).padStart(3, "0")}`
    family.membership_status = family.membership_status || "active"
    family.total_donations = 0
    family.last_donation = null

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

    // In real app, this would save to database
    // For now, we'll simulate the import process
    const importResult = {
      total_processed: families.length,
      successful_imports: families.length - Math.floor(families.length * 0.05), // 95% success rate
      failed_imports: Math.floor(families.length * 0.05),
      validation_errors: errors.slice(0, 10), // Show first 10 errors
      imported_families: families.slice(0, 5), // Show first 5 for preview
    }

    return NextResponse.json({
      success: true,
      data: importResult,
      message: `Successfully processed ${importResult.successful_imports} families`,
    })
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
  const sampleCSV = `family_name,head_of_family,phone,email,address,postal_code,city,country,notes
Ahmed Family,Mohammad Ahmed,416-555-0101,ahmed.family@email.com,"123 Maple Street",M1A 1A1,Toronto,Canada,Active member
Khan Family,Ali Khan,416-555-0102,khan.family@email.com,"456 Oak Avenue",M2B 2B2,Toronto,Canada,New member
Rahman Family,Abdul Rahman,416-555-0103,rahman.family@email.com,"789 Pine Road",M3C 3C3,Toronto,Canada,Regular donor`

  return new NextResponse(sampleCSV, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="family-import-template.csv"',
    },
  })
}
