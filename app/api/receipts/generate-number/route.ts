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
 * GET: Preview the next receipt number (without creating one).
 * POST: No longer needed — receipt generation is handled inside the donations API transaction.
 */
export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/receipts/generate-number")

  if (!process.env.DATABASE_URL) {
    log.error("Missing DATABASE_URL", { ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Database connection string not configured" },
      { status: 500 }
    )
  }

  try {
    const result = await pool.query("SELECT MAX(id) as max_id FROM receipts")
    const nextId = (parseInt(result.rows[0].max_id) || 0) + 1
    const nextReceiptNumber = `BGM-SANDA-{family_code}-${String(nextId).padStart(5, "0")}`

    log.info("Next receipt number previewed", { nextReceiptNumber, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: { next_receipt_number: nextReceiptNumber },
    })
  } catch (error) {
    log.error("Error fetching next receipt number", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json(
      { success: false, error: "Failed to fetch next receipt number" },
      { status: 500 }
    )
  }
}
