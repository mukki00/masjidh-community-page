import { NextResponse, NextRequest } from "next/server";
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

  // Block access to dev families for non-Developer users
  if (DEV_FAMILY_CODES.includes(family_code)) {
    const userRole = await getUserRole(request);
    if (userRole !== "Developer") {
      return NextResponse.json({ success: false, error: "Family ID not found" }, { status: 404 });
    }
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ familyId: string }> }) {
  const resolvedParams = await params;
  const family_code = resolvedParams?.familyId;

  if (!family_code) {
    return NextResponse.json({ success: false, error: "Missing familyId param" }, { status: 400 });
  }

  // Block access to dev families for non-Developer users
  if (DEV_FAMILY_CODES.includes(family_code)) {
    const userRole = await getUserRole(request);
    if (userRole !== "Developer") {
      return NextResponse.json({ success: false, error: "Family not found" }, { status: 404 });
    }
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Missing DATABASE_URL" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { family_name, phone, id_card_no, sanda_amount, arrears } = body;

    const result = await pool.query(
      `UPDATE families
       SET family_name = COALESCE($1, family_name),
           phone = COALESCE($2, phone),
           id_card_no = COALESCE($3, id_card_no),
           sanda_amount = COALESCE($4, sanda_amount),
           arrears = COALESCE($5, arrears)
       WHERE family_code = $6
       RETURNING family_code, family_name, id_card_no, phone, sanda_amount, arrears`,
      [family_name, phone, id_card_no, sanda_amount !== undefined ? parseFloat(sanda_amount) : null, arrears !== undefined ? parseFloat(arrears) : null, family_code]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Family not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}