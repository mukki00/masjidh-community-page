import { type NextRequest, NextResponse } from "next/server"

// Mock donation storage - in real app this would be PostgreSQL
const mockDonations: any[] = []
let receiptCounter = 1000

// Generate unique donation ID
function generateDonationId(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const sequence = String(mockDonations.length + 1).padStart(3, "0")
  return `DON-${year}${month}${day}-${sequence}`
}

// Generate unique receipt number
function generateReceiptNumber(): string {
  receiptCounter++
  return `REC-${receiptCounter}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { family_id, amount, category_id, payment_method, notes, collected_by } = body

    // Validation
    if (!family_id || !amount || !category_id || !payment_method) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ success: false, error: "Amount must be greater than 0" }, { status: 400 })
    }

    // Create donation record
    const donation = {
      id: mockDonations.length + 1,
      donation_id: generateDonationId(),
      family_id: Number.parseInt(family_id),
      category_id: Number.parseInt(category_id),
      amount: Number.parseFloat(amount),
      payment_method,
      payment_status: "completed",
      receipt_number: generateReceiptNumber(),
      collection_date: new Date().toISOString().split("T")[0],
      collected_by: collected_by || "System User",
      notes: notes || null,
      is_anonymous: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // In real app, this would be a database transaction
    mockDonations.push(donation)

    // Update daily collection summary (mock)
    const today = new Date().toISOString().split("T")[0]

    return NextResponse.json({
      success: true,
      data: {
        donation,
        receipt_url: `/api/receipts/${donation.receipt_number}`,
        message: "Donation processed successfully",
      },
    })
  } catch (error) {
    console.error("Error processing donation:", error)
    return NextResponse.json({ success: false, error: "Failed to process donation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const family_id = searchParams.get("family_id")
    const date = searchParams.get("date")

    let donations = mockDonations

    if (family_id) {
      donations = donations.filter((d) => d.family_id === Number.parseInt(family_id))
    }

    if (date) {
      donations = donations.filter((d) => d.collection_date === date)
    }

    return NextResponse.json({
      success: true,
      data: donations,
      total: donations.length,
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch donations" }, { status: 500 })
  }
}
