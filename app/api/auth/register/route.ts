import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, full_name, role, admin_secret } = body

    // Protect this endpoint with a secret
    if (admin_secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    if (!username || !password || !full_name) {
      return NextResponse.json({ success: false, error: "username, password, and full_name are required" }, { status: 400 })
    }

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(connectionString)
    const password_hash = await bcrypt.hash(password, 12)

    const result = await sql`INSERT INTO users (username, password_hash, full_name, role)
       VALUES (${username}, ${password_hash}, ${full_name}, ${role || "staff"})
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username, full_name, role`

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: "Username already exists" }, { status: 409 })
    }

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error: any) {
    console.error("Register error:", error?.message || error)
    return NextResponse.json({ success: false, error: error?.message || "Failed to create user" }, { status: 500 })
  }
}
