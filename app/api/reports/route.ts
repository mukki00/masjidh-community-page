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
  const log = createRouteLogger(request, "/api/reports")

  if (!process.env.DATABASE_URL) {
    log.error("Missing DATABASE_URL", { ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Missing DATABASE_URL" },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })).toISOString().split("T")[0]

    // Daily summary: total amount, transaction count, breakdown by payment method
    const summaryRes = await pool.query(
      `SELECT
         COALESCE(SUM(amount), 0) as total_amount,
         COUNT(*) as total_transactions,
         COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN amount ELSE 0 END), 0) as cash_amount,
         COALESCE(SUM(CASE WHEN payment_method = 'bank' THEN amount ELSE 0 END), 0) as bank_amount,
         MIN(transaction_date) as opened_at
       FROM payment
       WHERE transaction_date::date = $1`,
      [date]
    )

    const summary = summaryRes.rows[0]

    const reportData = {
      total_amount: parseFloat(summary.total_amount),
      total_transactions: parseInt(summary.total_transactions),
      cash_amount: parseFloat(summary.cash_amount),
      bank_amount: parseFloat(summary.bank_amount),
      opened_at: summary.opened_at,
      status: parseInt(summary.total_transactions) > 0 ? "open" : "no-activity",
    }

    log.info("Report fetched", { date, total_transactions: reportData.total_transactions, total_amount: reportData.total_amount, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: reportData,
    })
  } catch (error) {
    log.error("Error fetching report data", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Failed to fetch report data" },
      { status: 500 }
    )
  }
}
