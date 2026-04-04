import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function SAVE(request: NextRequest) {
    try{
        const body = await request.json();
        const { receipt_number } = body;
        const connection_string = process.env.DATABASE_URL;
        if (!connection_string) {
            return NextResponse.json(
                { success: false, error: "Database connection string not configured" },
                { status: 500 }
            );
        }
        const client = neon(connection_string);
        const currentDate = new Date();
        const result = await client.query(`INSERT INTO public.receipts(	receipt_number, receipt_date, receipt_html, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
            RETURNING receipt_number`, [
                receipt_number,
                currentDate,
                "<div>Receipt content goes here</div>",
                currentDate,
                currentDate
            ]);

        if (!result || result.length === 0) {
            return NextResponse.json({ success: false, error: "Failed to insert receipt record" }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: { receipt_number: result[0].receipt_number } }, { status: 200 });
    }catch(error){
        console.error("Error generating receipt number:", error);
        return NextResponse.json({ success: false, error: "Failed to generate receipt number" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    //find the latest receipt number from table receipts
    const body = await request.json()
    const { family_id } = body

    let receipt_number = `BGM-SANDA-${family_id}`
    const connection_string = process.env.DATABASE_URL
    if (!connection_string) {
      return NextResponse.json(
        { success: false, error: "Database connection string not configured" },
        { status: 500 }
      )
    }
    const client = neon(connection_string)
    const result = await client.query("SELECT MAX(id) FROM public.receipts")
    const get_max_receipt_number = result[0].max || "0"
    let max_receipt_number = parseInt(get_max_receipt_number) + 1
    receipt_number += "-" + String(max_receipt_number).padStart(5, "0")
    return NextResponse.json({ success: true, data: { receipt_number: receipt_number } }, { status: 200 })
  } catch (error) {
    console.error("Error generating receipt number:", error)
    return NextResponse.json({ success: false, error: "Failed to generate receipt number" }, { status: 500 })
  }
}
