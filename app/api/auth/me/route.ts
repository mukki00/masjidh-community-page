import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-me")

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

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
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 })
  }
}
