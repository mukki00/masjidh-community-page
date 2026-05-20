import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg";
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me")

const DEV_FAMILY_CODES = ['FAM122', 'FAM132', 'FAM142'];

declare global {
  var _pgPool: Pool | undefined;
}

const pool: Pool = globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
});


if (!globalThis._pgPool) globalThis._pgPool = pool;

async function getUserRole(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return (payload.role as string) || null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Missing DATABASE_URL" }, { status: 500 });
  }

  try {
    const userRole = await getUserRole(request);
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim();

    let query = `
      SELECT family_code, family_name, id_card_no, phone, sanda_amount, arrears
      FROM families
    `;
    const params: (string | string[])[] = [];
    const conditions: string[] = [];

    // Only return active families
    conditions.push(`active = true`);

    // Exclude dev family codes for non-Developer users
    if (userRole !== "Developer") {
      params.push(DEV_FAMILY_CODES);
      conditions.push(`family_code != ALL($${params.length})`);
    }

    if (search && search.length > 0) {
      params.push(`%${search}%`);
      const searchParam = `$${params.length}`;
      conditions.push(`(family_code ILIKE ${searchParam}
          OR family_name ILIKE ${searchParam}
          OR id_card_no ILIKE ${searchParam}
          OR phone ILIKE ${searchParam})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(` AND `);
    }

    query += ` ORDER BY family_code`;

    const familiesRes = await pool.query(query, params);
    if (familiesRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Family ID not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: familiesRes.rows,
      total: familiesRes.rowCount,
    })
  } catch (error) {
    console.error("Error fetching families:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch families" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Missing DATABASE_URL" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { family_code, family_name, id_card_no, phone, sanda_amount, arrears } = body;

    if (!family_code || !family_name || !sanda_amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: family_code, family_name, sanda_amount" },
        { status: 400 }
      );
    }

    if (id_card_no && String(id_card_no).length > 12) {
      return NextResponse.json(
        { success: false, error: "id_card_no must be at most 12 characters" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO families (family_code, family_name, id_card_no, phone, sanda_amount, arrears)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING family_code, family_name, id_card_no, phone, sanda_amount, arrears`,
      [family_code, family_name, id_card_no, phone, sanda_amount, arrears || 0]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating family:", error);
    if (error?.code === "23505") {
      return NextResponse.json({ success: false, error: "Family code already exists" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create family" }, { status: 500 });
  }
}
