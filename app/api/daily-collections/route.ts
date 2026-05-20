import { type NextRequest, NextResponse } from "next/server"
import { createRouteLogger, elapsed } from "@/lib/logger"

function slNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }))
}

// Mock daily collections data
const dailyCollections = [
  {
    id: 1,
    collection_date: slNow().toISOString().split("T")[0],
    total_amount: 1250.0,
    total_transactions: 45,
    cash_amount: 650.0,
    card_amount: 400.0,
    cheque_amount: 150.0,
    online_amount: 50.0,
    opened_by: "Admin User",
    closed_by: null,
    opened_at: slNow().toISOString(),
    closed_at: null,
    status: "open",
    notes: null,
    created_at: slNow().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/daily-collections")

  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date") || slNow().toISOString().split("T")[0]

    const collection = dailyCollections.find((c) => c.collection_date === date)

    if (!collection) {
      // Create new collection for the date
      const newCollection = {
        id: dailyCollections.length + 1,
        collection_date: date,
        total_amount: 0,
        total_transactions: 0,
        cash_amount: 0,
        card_amount: 0,
        cheque_amount: 0,
        online_amount: 0,
        opened_by: "System",
        closed_by: null,
        opened_at: slNow().toISOString(),
        closed_at: null,
        status: "open",
        notes: null,
        created_at: slNow().toISOString(),
      }
      dailyCollections.push(newCollection)

      log.info("Daily collection created (new date)", { date, ...elapsed(startedAt), status: 200 })
      await log.flush()
      return NextResponse.json({
        success: true,
        data: newCollection,
      })
    }

    log.info("Daily collection fetched", { date, status: collection.status, ...elapsed(startedAt), status_code: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: collection,
    })
  } catch (error) {
    log.error("Error fetching daily collection", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Failed to fetch daily collection" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/daily-collections")

  try {
    const body = await request.json()
    const { action, date, closed_by } = body

    if (action === "close") {
      const collection = dailyCollections.find((c) => c.collection_date === date)
      if (collection) {
        collection.status = "closed"
        collection.closed_by = closed_by || "System"
        collection.closed_at = slNow().toISOString()

        log.info("Daily collection closed", { date, closed_by: collection.closed_by, ...elapsed(startedAt), status: 200 })
        await log.flush()
        return NextResponse.json({
          success: true,
          data: collection,
          message: "Daily collection closed successfully",
        })
      }
    }

    log.warn("Invalid action or collection not found", { action, date, ...elapsed(startedAt), status: 400 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Invalid action or collection not found" }, { status: 400 })
  } catch (error) {
    log.error("Error updating daily collection", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Failed to update daily collection" }, { status: 500 })
  }
}
