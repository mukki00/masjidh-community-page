import { NextResponse } from "next/server"

const donationCategories = [
  { id: 1, name: "General Donation", description: "General masjid support and maintenance" },
  { id: 2, name: "Zakat", description: "Obligatory charity payment" },
  { id: 3, name: "Sadaqah", description: "Voluntary charity" },
  { id: 4, name: "Building Fund", description: "Masjid construction and renovation" },
  { id: 5, name: "Education Fund", description: "Islamic education and programs" },
  { id: 6, name: "Utility Bills", description: "Monthly utility payments" },
  { id: 7, name: "Special Events", description: "Eid celebrations and special programs" },
  { id: 8, name: "Emergency Fund", description: "Community emergency support" },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: donationCategories,
    })
  } catch (error) {
    console.error("Error fetching donation categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch donation categories" }, { status: 500 })
  }
}
