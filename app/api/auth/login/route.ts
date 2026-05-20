import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { createRouteLogger, elapsed } from "@/lib/logger"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me")

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/auth/login")

  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      log.warn("Login attempt missing credentials", { ...elapsed(startedAt), status: 400 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      log.error("Database not configured", { ...elapsed(startedAt), status: 500 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(connectionString)
    const result = await sql`SELECT id, username, password_hash, full_name, role, is_active FROM users WHERE username = ${username}`

    if (!result || result.length === 0) {
      log.warn("Login failed: user not found", { username, ...elapsed(startedAt), status: 401 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }

    const user = result[0]

    if (!user.is_active) {
      log.warn("Login failed: account deactivated", { username, ...elapsed(startedAt), status: 403 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Account is deactivated" }, { status: 403 })
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
      log.warn("Login failed: invalid password", { username, ...elapsed(startedAt), status: 401 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 })
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET)

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    log.info("Login successful", { username, role: user.role, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return response
  } catch (error) {
    log.error("Login error", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
