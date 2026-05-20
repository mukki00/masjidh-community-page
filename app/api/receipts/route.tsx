import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"
import { createRouteLogger, elapsed } from "@/lib/logger"

// Mock data - in real app this would come from database
const mockDonations = [
  {
    id: 1,
    donation_id: "DON-20240103-001",
    family_id: 1,
    category_id: 1,
    amount: 100.0,
    payment_method: "cash",
    payment_status: "completed",
    receipt_number: "REC-1001",
    collection_date: "2024-01-03",
    collected_by: "Admin User",
    notes: "Monthly donation",
    created_at: "2024-01-03T10:30:00Z",
  },
]

const mockFamilies = [
  {
    id: 1,
    family_id: "FAM001",
    family_name: "Ahmed Family",
    head_of_family: "Mohammad Ahmed",
    phone: "416-555-0101",
    email: "ahmed.family@email.com",
    address: "123 Maple Street, Toronto, M1A 1A1",
  },
]

const donationCategories = [
  { id: 1, name: "General Donation", description: "General masjid support and maintenance" },
  { id: 2, name: "Zakat", description: "Obligatory charity payment" },
  { id: 3, name: "Sadaqah", description: "Voluntary charity" },
  { id: 4, name: "Building Fund", description: "Masjid construction and renovation" },
  { id: 5, name: "Education Fund", description: "Islamic education and programs" },
]

function generatePDFContent(donation: any, family: any, category: any) {
  const currentDate = new Date().toLocaleDateString("en-LK", { timeZone: "Asia/Colombo" })
  const donationDate = new Date(donation.collection_date).toLocaleDateString()

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Donation Receipt - ${donation.receipt_number}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 8px;
            color: #333;
            line-height: 1.4;
            font-size: 16px;
        }
        .receipt-container {
            max-width: 400px;
            margin: 0 auto;
            border: 1px solid #059669;
            border-radius: 6px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: white;
            padding: 10px 12px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header p {
            margin: 2px 0 0 0;
            font-size: 18px;
            font-weight: bold;
            opacity: 1;
        }
        .content {
            padding: 10px 12px;
        }
        .receipt-info {
            background: #f8fafc;
            padding: 8px 10px;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        .receipt-info h2 {
            margin: 0 0 6px 0;
            color: #059669;
            font-size: 18px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1px;
        }
        .info-value {
            color: #111827;
            font-size: 16px;
        }
        .amount-section {
            background: #ecfdf5;
            border: 1px solid #059669;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            margin: 8px 0;
        }
        .amount-label {
            font-size: 16px;
            color: #047857;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 2px;
        }
        .amount-value {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            margin: 0;
        }
        .family-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
            margin-top: 8px;
        }
        .family-section h3 {
            margin: 0 0 6px 0;
            color: #374151;
            font-size: 16px;
        }
        .thank-you {
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            padding: 8px 10px;
            margin: 10px 0;
            border-radius: 0 4px 4px 0;
        }
        .thank-you p {
            margin: 0;
            color: #92400e;
            font-style: italic;
        }
        .footer {
            background: #f9fafb;
            padding: 8px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 16px;
            color: #6b7280;
        }
        .contact-info {
            margin-top: 4px;
        }
        .tax-notice {
            background: #eff6ff;
            border: 1px solid #3b82f6;
            border-radius: 4px;
            padding: 8px;
            margin: 8px 0;
            font-size: 16px;
            color: #1e40af;
        }
        @media print {
            body { margin: 0; padding: 4px; }
            .receipt-container { border: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>🕌 Jummah Masjid</h1>
            <p>Donation Receipt</p>
        </div>
        
        <div class="content">
            <div class="receipt-info">
                <h2>Receipt Details</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Receipt No.</span>
                        <span class="info-value">${donation.receipt_number}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Donation ID</span>
                        <span class="info-value">${donation.donation_id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date</span>
                        <span class="info-value">${donationDate}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Payment</span>
                        <span class="info-value">${donation.payment_method.charAt(0).toUpperCase() + donation.payment_method.slice(1)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Category</span>
                        <span class="info-value">${category.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Collected By</span>
                        <span class="info-value">${donation.collected_by}</span>
                    </div>
                </div>
            </div>

            <div class="amount-section">
                <div class="amount-label">Total Donation Amount</div>
                <div class="amount-value">$${donation.amount.toFixed(2)} CAD</div>
            </div>

            <div class="family-section">
                <h3>Donor Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Family Name</span>
                        <span class="info-value">${family.family_name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Head of Family</span>
                        <span class="info-value">${family.head_of_family}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Family ID</span>
                        <span class="info-value">${family.family_id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Contact</span>
                        <span class="info-value">${family.phone}</span>
                    </div>
                </div>
                ${
                  family.address
                    ? `
                <div style="margin-top: 6px;">
                    <span class="info-label">Address</span>
                    <div class="info-value">${family.address}</div>
                </div>
                `
                    : ""
                }
            </div>

            ${
              donation.notes
                ? `
            <div style="margin-top: 8px;">
                <span class="info-label">Notes</span>
                <div class="info-value" style="margin-top: 2px;">${donation.notes}</div>
            </div>
            `
                : ""
            }

            <div class="thank-you">
                <p>"And Allah multiplies [His reward] for whom He wills." - Quran 2:261</p>
            </div>

            <div class="tax-notice">
                <strong>Tax Receipt Notice:</strong> This receipt serves as acknowledgment of your donation to Jummah Masjid. 
                Charitable Registration Number: 123456789RR0001
            </div>
        </div>

        <div class="footer">
            <div><strong>Jummah Masjid</strong></div>
            <div class="contact-info">
                123 Community Street, City 12345 | (555) 123-4567<br>
                Generated on ${currentDate}
            </div>
        </div>
    </div>
</body>
</html>
  `
}

export async function GET(request: NextRequest, { params }: { params: { receiptNumber: string } }) {
  const startedAt = Date.now()
  const log = createRouteLogger(request, "/api/receipts")

  try {
    const receiptNumber = params.receiptNumber

    // Find donation by receipt number
    const donation = mockDonations.find((d) => d.receipt_number === receiptNumber)
    if (!donation) {
      log.warn("Receipt not found", { receiptNumber, ...elapsed(startedAt), status: 404 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Receipt not found" }, { status: 404 })
    }

    // Find family information
    const family = mockFamilies.find((f) => f.id === donation.family_id)
    if (!family) {
      log.warn("Family information not found for receipt", { receiptNumber, family_id: donation.family_id, ...elapsed(startedAt), status: 404 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Family information not found" }, { status: 404 })
    }

    // Find donation category
    const category = donationCategories.find((c) => c.id === donation.category_id)
    if (!category) {
      log.warn("Donation category not found for receipt", { receiptNumber, category_id: donation.category_id, ...elapsed(startedAt), status: 404 })
      await log.flush()
      return NextResponse.json({ success: false, error: "Donation category not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "html"

    if (format === "pdf") {
      // For PDF generation, we'll return HTML that can be converted to PDF by the client
      // In a real app, you might use puppeteer or similar server-side PDF generation
      const htmlContent = generatePDFContent(donation, family, category)

      return new NextResponse(htmlContent, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="receipt-${receiptNumber}.html"`,
        },
      })
    }

    // Return receipt data as JSON
    log.info("Receipt fetched", { receiptNumber: params.receiptNumber, format, ...elapsed(startedAt), status: 200 })
    await log.flush()
    return NextResponse.json({
      success: true,
      data: {
        donation,
        family,
        category,
        receipt_html: generatePDFContent(donation, family, category),
      },
    })
  } catch (error) {
    log.error("Error generating receipt", { error: String(error), ...elapsed(startedAt), status: 500 })
    await log.flush()
    return NextResponse.json({ success: false, error: "Failed to generate receipt" }, { status: 500 })
  }
}