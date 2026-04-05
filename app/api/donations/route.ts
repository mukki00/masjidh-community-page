import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

declare global {
  var _pgPool: Pool | undefined
}

const pool: Pool =
  globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (!globalThis._pgPool) globalThis._pgPool = pool

function generateReceiptHtml(
  receiptNumber: string,
  familyCode: string,
  familyName: string,
  phone: string,
  amount: number,
  paymentMethod: string,
  collectedBy: string,
  transactionDate: Date,
  previousArrears: number,
  newArrears: number,
  notes?: string
): string {
  const dateStr = transactionDate.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SANDA Receipt - ${receiptNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
    .receipt-container { max-width: 600px; margin: 0 auto; border: 2px solid #059669; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 5px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 30px 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px; }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-weight: bold; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .info-value { color: #111827; font-size: 14px; }
    .amount-section { background: #ecfdf5; border: 2px solid #059669; border-radius: 8px; padding: 25px; text-align: center; margin: 20px 0; }
    .amount-label { font-size: 14px; color: #047857; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .amount-value { font-size: 36px; font-weight: bold; color: #059669; margin: 0; }
    .arrears-section { display: flex; justify-content: space-between; background: #f9fafb; padding: 15px 20px; border-radius: 6px; margin: 15px 0; font-size: 14px; }
    .thank-you { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 6px 6px 0; }
    .thank-you p { margin: 0; color: #92400e; font-style: italic; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    @media print { body { margin: 0; } .receipt-container { border: none; } }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <h1>Jummah Masjid</h1>
      <p>SANDA Collection Receipt</p>
    </div>
    <div class="content">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Receipt Number</span>
          <span class="info-value">${receiptNumber}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Date</span>
          <span class="info-value">${dateStr}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Family Code</span>
          <span class="info-value">${familyCode}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Family Name</span>
          <span class="info-value">${familyName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Phone</span>
          <span class="info-value">${phone || "N/A"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Payment Method</span>
          <span class="info-value">${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Collected By</span>
          <span class="info-value">${collectedBy}</span>
        </div>
      </div>
      <div class="amount-section">
        <div class="amount-label">Amount Paid</div>
        <div class="amount-value">LKR ${amount.toFixed(2)}</div>
      </div>
      <div class="arrears-section">
        <div><span class="info-label">Previous Arrears</span><br/>LKR ${previousArrears.toFixed(2)}</div>
        <div><span class="info-label">${newArrears < 0 ? "Credit Balance" : "Remaining Arrears"}</span><br/>LKR ${Math.abs(newArrears).toFixed(2)}</div>
      </div>
      ${notes ? `<div style="margin-top: 15px;"><span class="info-label">Notes</span><div class="info-value" style="margin-top: 5px;">${notes}</div></div>` : ""}
      <div class="thank-you">
        <p>"The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes; in each spike is a hundred grains. And Allah multiplies [His reward] for whom He wills." - Quran 2:261</p>
      </div>
    </div>
    <div class="footer">
      <div><strong>Jummah Masjid</strong></div>
      <div>Generated on ${dateStr}</div>
    </div>
  </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Database connection string not configured" },
      { status: 500 }
    )
  }

  const client = await pool.connect()

  try {
    const body = await request.json()
    const { family_code, amount, payment_method, notes, collected_by } = body

    if (!family_code || !amount || !payment_method || !collected_by) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const parsedAmount = parseFloat(amount)
    if (parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    // Use a transaction so all steps succeed or all roll back
    await client.query("BEGIN")

    // 1. Fetch current family details (lock the row for update)
    const familyRes = await client.query(
      `SELECT family_code, family_name, phone, sanda_amount, arrears
       FROM families
       WHERE family_code = $1
       FOR UPDATE`,
      [family_code]
    )

    if (familyRes.rowCount === 0) {
      await client.query("ROLLBACK")
      return NextResponse.json(
        { success: false, error: "Family not found" },
        { status: 404 }
      )
    }

    const family = familyRes.rows[0]
    const previousArrears = parseFloat(family.arrears) || 0

    // 2. Deduct amount from arrears (can go negative = credit)
    const newArrears = previousArrears - parsedAmount

    await client.query(
      `UPDATE families SET arrears = $1 WHERE family_code = $2`,
      [newArrears, family_code]
    )

    // 3. Insert receipt into receipts table (id auto-increments)
    const transactionDate = new Date()
    const receiptHtml = generateReceiptHtml(
      "", // placeholder, will update after we get the id
      family_code,
      family.family_name,
      family.phone,
      parsedAmount,
      payment_method,
      collected_by,
      transactionDate,
      previousArrears,
      newArrears,
      notes
    )

    const receiptRes = await client.query(
      `INSERT INTO receipts (receipt_number, receipt_date, receipt_html, created_at, updated_at)
       VALUES ('PENDING', $1, $2, $1, $1)
       RETURNING id`,
      [transactionDate, receiptHtml]
    )

    const receiptId = receiptRes.rows[0].id
    const receiptNumber = `BGM-SANDA-${family_code}-${String(receiptId).padStart(5, "0")}`

    // Update the receipt with the real receipt_number and final HTML
    const finalHtml = generateReceiptHtml(
      receiptNumber,
      family_code,
      family.family_name,
      family.phone,
      parsedAmount,
      payment_method,
      collected_by,
      transactionDate,
      previousArrears,
      newArrears,
      notes
    )

    await client.query(
      `UPDATE receipts SET receipt_number = $1, receipt_html = $2 WHERE id = $3`,
      [receiptNumber, finalHtml, receiptId]
    )

    // 4. Insert payment with the receipt_number
    const paymentRes = await client.query(
      `INSERT INTO payment (family_code, amount, payment_method, notes, collected_by, receipt_number, transaction_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $7)
       RETURNING id, receipt_number, family_code, amount, transaction_date`,
      [
        family_code,
        parsedAmount,
        payment_method,
        notes || null,
        collected_by,
        receiptNumber,
        transactionDate,
      ]
    )

    await client.query("COMMIT")

    const payment = paymentRes.rows[0]

    return NextResponse.json(
      {
        success: true,
        data: {
          id: payment.id,
          family_code: payment.family_code,
          amount: payment.amount,
          payment_method,
          receipt_number: payment.receipt_number,
          transaction_date: payment.transaction_date,
          previous_arrears: previousArrears,
          new_arrears: newArrears,
          message: "Payment recorded successfully",
        },
      },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error processing payment:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { success: false, error: "Missing DATABASE_URL" },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const family_code = searchParams.get("family_code")
    const date = searchParams.get("date")

    let query = `SELECT p.*, f.family_name FROM payment p JOIN families f ON p.family_code = f.family_code WHERE 1=1`
    const params: any[] = []
    let idx = 1

    if (family_code) {
      query += ` AND p.family_code = $${idx++}`
      params.push(family_code)
    }

    if (date) {
      query += ` AND p.transaction_date::date = $${idx++}`
      params.push(date)
    }

    query += ` ORDER BY p.transaction_date DESC`

    const result = await pool.query(query, params)

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations" },
      { status: 500 }
    )
  }
}
