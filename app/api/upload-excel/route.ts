import { parseExcelFile } from "@/lib/excel-parser"
import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE_PATH = path.join(process.cwd(), "data", "banking-data.json")

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const excelData = await parseExcelFile(buffer)

    // Save to JSON file
    const jsonData = {
      data: excelData.data,
      lastUpdated: new Date().toISOString(),
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      data: excelData.data,
      lastUpdated: jsonData.lastUpdated,
    })
  } catch (error) {
    console.error("Error processing Excel file:", error)
    return NextResponse.json({ error: "Failed to process Excel file" }, { status: 500 })
  }
}
