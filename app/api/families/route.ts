import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

const pool: Pool = globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
});


if (!globalThis._pgPool) globalThis._pgPool = pool;


export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Missing DATABASE_URL" }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim();

    let query = `
      SELECT family_code, family_name, id_card_no, phone, sanda_amount, arrears
      FROM families
    `;
    const params: string[] = [];

    if (search && search.length > 0) {
      query += `
        WHERE family_code ILIKE $1
          OR family_name ILIKE $1
          OR id_card_no ILIKE $1
          OR phone ILIKE $1
      `;
      params.push(`%${search}%`);
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
