import { type NextRequest, NextResponse } from "next/server"
import { createRouteLogger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const log = createRouteLogger(request, "/api/auth/logout")
  const response = NextResponse.json({ success: true })
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  log.info("User logged out", { status: 200 })
  await log.flush()
  return response
}
