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
