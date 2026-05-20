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

export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/sanda-stats")

  if (!process.env.DATABASE_URL) {
    log.error("Missing DATABASE_URL", { ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Missing DATABASE_URL" },
      { status: 500 }
    )
  }

  try {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })).toISOString().split("T")[0]

    const [familiesRes, todayPaymentsRes, todayReceiptsRes] = await Promise.all([
      pool.query("SELECT COUNT(*) as total FROM families"),
      pool.query(
        "SELECT COALESCE(SUM(amount), 0) as total FROM payment WHERE transaction_date::date = $1",
        [today]
      ),
      pool.query(
        "SELECT COUNT(*) as total FROM receipts WHERE receipt_date::date = $1",
        [today]
      ),
    ])

    const stats = {
      total_families: parseInt(familiesRes.rows[0].total),
      todays_collections: parseFloat(todayPaymentsRes.rows[0].total),
      receipts_issued: parseInt(todayReceiptsRes.rows[0].total),
    }

    log.info("Sanda stats fetched", { ...stats, today, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    log.error("Error fetching sanda stats", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
