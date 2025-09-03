import { NextResponse } from "next/server";

const mockFamilies = [
  {
    family_id: "FAM001",
    family_name: "Ahmed Family",
    head_of_family: "Mohammad Ahmed",
    phone: "416-555-0101",
    address: "123 Maple Street",
    amount_due: 1500,
    arrears: 500,
    arrears_per_month: { "Jan 2025": 200, "Feb 2025": 300 },
  },
  {
    family_id: "FAM002",
    family_name: "Khan Family",
    head_of_family: "Ali Khan",
    phone: "416-555-0102",
    address: "456 Oak Avenue",
    amount_due: 1200,
    arrears: 0,
    arrears_per_month: {},
  },
];

export async function GET(request, { params }) {
  const { familyId } = params;
  const family = mockFamilies.find(f => f.family_id === familyId);

  if (family) {
    return NextResponse.json({ success: true, data: family });
  } else {
    return NextResponse.json({ success: false, error: "Family ID not found" }, { status: 404 });
  }
}