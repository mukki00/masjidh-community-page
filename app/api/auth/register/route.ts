import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { createRouteLogger, elapsed } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/auth/register")

  try {
    const body = await request.json()
    const { username, password, full_name, role, admin_secret } = body

    // Protect this endpoint with a secret
    if (admin_secret !== process.env.ADMIN_SECRET) {
      log.warn("Register failed: invalid admin_secret", { ...elapsed(startedAt), status: 403 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    if (!username || !password || !full_name) {
      log.warn("Register failed: missing required fields", { ...elapsed(startedAt), status: 400 })
      await log.flush()
      return NextResponse.json({ success: false, error: "username, password, and full_name are required" }, { status: 400 })
    }

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      log.error("Database not configured", { ...elapsed(startedAt), status: 500 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(connectionString)
    const password_hash = await bcrypt.hash(password, 12)

    const result = await sql`INSERT INTO users (username, password_hash, full_name, role)
       VALUES (${username}, ${password_hash}, ${full_name}, ${role || "staff"})
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username, full_name, role`

    if (!result || result.length === 0) {
      log.warn("Register failed: username already exists", { username, ...elapsed(startedAt), status: 409 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Username already exists" }, { status: 409 })
    }

    log.info("User registered", { username, role: role || "staff", ...elapsed(startedAt), status: 201 })
    await log.flush()
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 })
  } catch (error: any) {
    log.error("Register error", { error: error?.message || String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json({ success: false, error: error?.message || "Failed to create user" }, { status: 500 })
  }
}
