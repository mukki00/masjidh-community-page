import { type NextRequest, NextResponse } from "next/server"

// Mock database - in real app this would connect to PostgreSQL
const mockFamilies = [
  {
    id: 1,
    family_id: "FAM001",
    family_name: "Ahmed Family",
    head_of_family: "Mohammad Ahmed",
    phone: "416-555-0101",
    email: "ahmed.family@email.com",
    address: "123 Maple Street, Toronto, M1A 1A1",
    membership_status: "active",
    total_donations: 850.0,
    last_donation: "2024-01-15",
    members: ["Mohammad Ahmed", "Fatima Ahmed", "Aisha Ahmed", "Omar Ahmed"],
  },
  {
    id: 2,
    family_id: "FAM002",
    family_name: "Khan Family",
    head_of_family: "Ali Khan",
    phone: "416-555-0102",
    email: "khan.family@email.com",
    address: "456 Oak Avenue, Toronto, M2B 2B2",
    membership_status: "active",
    total_donations: 1200.0,
    last_donation: "2024-01-20",
    members: ["Ali Khan", "Khadija Khan", "Hassan Khan"],
  },
  {
    id: 3,
    family_id: "FAM003",
    family_name: "Rahman Family",
    head_of_family: "Abdul Rahman",
    phone: "416-555-0103",
    email: "rahman.family@email.com",
    address: "789 Pine Road, Toronto, M3C 3C3",
    membership_status: "active",
    total_donations: 650.0,
    last_donation: "2024-01-10",
    members: ["Abdul Rahman", "Maryam Rahman", "Zainab Rahman", "Ibrahim Rahman", "Abdullah Rahman"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let families = mockFamilies

    if (search) {
      families = mockFamilies.filter(
        (family) =>
          family.family_name.toLowerCase().includes(search.toLowerCase()) ||
          family.family_id.toLowerCase().includes(search.toLowerCase()) ||
          family.head_of_family.toLowerCase().includes(search.toLowerCase()) ||
          family.phone.includes(search),
      )
    }

    return NextResponse.json({
      success: true,
      data: families,
      total: families.length,
    })
  } catch (error) {
    console.error("Error fetching families:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch families" }, { status: 500 })
  }
}
