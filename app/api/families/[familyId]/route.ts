import { NextResponse, NextRequest } from "next/server";
import { Pool } from "pg";

declare global {
  var _pgPool: Pool | undefined;
}

const pool: Pool = globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (!globalThis._pgPool) globalThis._pgPool = pool;

export async function GET(request: NextRequest, { params }: { params: Promise<{ familyId: string }> }) {
  const resolvedParams = await params;
  const family_code = resolvedParams?.familyId;
  console.log("Fetching family with code:", family_code);

  if (!family_code) {
    return NextResponse.json({ success: false, error: "Missing familyId param" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Missing DATABASE_URL" }, { status: 500 });
  }

  try {
    const familyRes = await pool.query(
      `SELECT family_code, family_name, id_card_no, phone, sanda_amount, arrears
       FROM families
       WHERE family_code = $1`,
      [family_code]
    );

    if (familyRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Family ID not found" }, { status: 404 });
    }

    const family = familyRes.rows[0];

    return NextResponse.json({ success: true, data: family });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}