import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless";
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
  return `BGM-SANDA-${receiptCounter}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { family_code, amount, payment_method, notes, collected_by } = body
    // Validation
    if (!family_code || !amount || !payment_method || !collected_by) {
      console.error("Missing required fields:", body)
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (parseFloat(amount) <= 0) {
      console.log("Invalid amount:", amount)
      return NextResponse.json({ success: false, error: "Amount must be greater than 0" }, { status: 400 })
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database connection string not configured" }, { status: 500 });
    }

    const client = neon(connectionString);
    
    const receipt_number = "BGM-SANDA-1008";
    const transaction_date = new Date();
    const created_at = new Date();
    const updated_at = new Date();

    const result = await client.query(
      `INSERT INTO public.payment(
        family_code, amount, payment_method, notes, collected_by, receipt_number, transaction_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, receipt_number, family_code, amount, transaction_date`,
      [
        family_code,
        parseFloat(amount),
        payment_method,
        notes || null,
        collected_by,
        receipt_number,
        transaction_date,
        created_at,
        updated_at
      ]
    );
    
    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: "Failed to insert payment record" }, { status: 500 });
    }

    const payment = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: payment.id,
        family_code: payment.family_code,
        amount: payment.amount,
        payment_method,
        receipt_number: payment.receipt_number,
        transaction_date: payment.transaction_date,
        message: "Payment recorded successfully"
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ success: false, error: "Failed to process payment" }, { status: 500 })
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
