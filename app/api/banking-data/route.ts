import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE_PATH = path.join(process.cwd(), "data", "banking-data.json")

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8")
    const jsonData = JSON.parse(fileContent)
    
    return NextResponse.json({
      success: true,
      data: jsonData.data,
      lastUpdated: jsonData.lastUpdated,
    })
  } catch (error) {
    console.error("Error reading banking data:", error)
    return NextResponse.json(
      { error: "Failed to read banking data" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, lastUpdated } = body

    if (!data) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      )
    }

    const jsonData = {
      data,
      lastUpdated: lastUpdated || new Date().toISOString(),
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      message: "Banking data saved successfully",
      lastUpdated: jsonData.lastUpdated,
    })
  } catch (error) {
    console.error("Error saving banking data:", error)
    return NextResponse.json(
      { error: "Failed to save banking data" },
      { status: 500 }
    )
  }
}
