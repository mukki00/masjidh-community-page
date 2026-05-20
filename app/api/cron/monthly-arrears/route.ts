import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { createRouteLogger, elapsed } from "@/lib/logger"

declare global {
  var _pgPool: Pool | undefined
}

const pool: Pool =
  globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (!globalThis._pgPool) globalThis._pgPool = pool

/**
 * Monthly SANDA arrears update.
 * On the 1st of every month, each family's arrears is increased by their sanda_amount.
 * Protected by CRON_SECRET so only Vercel Cron (or an admin) can trigger it.
 */
export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/cron/monthly-arrears")

  // Verify the request is from Vercel Cron or an authorized caller
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    log.warn("Cron: unauthorized request", { ...elapsed(startedAt), status: 401 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  if (!process.env.DATABASE_URL) {
    log.error("Missing DATABASE_URL", { ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Missing DATABASE_URL" },
      { status: 500 }
    )
  }

  try {
    const result = await pool.query(
      `UPDATE families
       SET arrears = COALESCE(arrears, 0) + COALESCE(sanda_amount, 0),
           updated_at = CURRENT_TIMESTAMP
       WHERE sanda_amount > 0
       RETURNING family_code, family_name, sanda_amount, arrears`
    )

    log.info("Monthly arrears updated", { updated_count: result.rowCount, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      message: `Monthly arrears updated for ${result.rowCount} families`,
      data: {
        updated_count: result.rowCount,
        updated_at: new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })).toISOString(),
      },
    })
  } catch (error) {
    log.error("Error updating monthly arrears", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Failed to update monthly arrears" },
      { status: 500 }
    )
  }
}
