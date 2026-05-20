import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { createRouteLogger } from "@/lib/logger"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me")

export async function GET(request: NextRequest) {
  const log = createRouteLogger(request, "/api/auth/me")

  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      log.warn("Unauthenticated /me request", { status: 401 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    log.info("Authenticated user fetched", { username: payload.username, role: payload.role, status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: {
        id: payload.id,
        username: payload.username,
        full_name: payload.full_name,
        role: payload.role,
      },
    })
  } catch {
    log.warn("Invalid or expired token on /me", { status: 401 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
  }
}
