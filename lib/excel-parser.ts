"use server"

import type { BankingMetrics } from "./banking-data"

export interface ExcelData {
  data: Record<string, BankingMetrics>
  lastUpdated: Date
}

export async function parseExcelFile(buffer: Buffer): Promise<ExcelData> {
  try {
    const XLSX = await import("xlsx")

    const workbook = XLSX.read(buffer, { type: "buffer" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    const bankingData: Record<string, BankingMetrics> = {}

    // Group rows by category
    const groupedByCategory: Record<string, any[]> = {}
    jsonData.forEach((row: any) => {
      const category = row.Category || row.category
      if (category) {
        if (!groupedByCategory[category]) {
          groupedByCategory[category] = []
        }
        groupedByCategory[category].push(row)
      }
    })

    // Process each category
    Object.entries(groupedByCategory).forEach(([category, rows]) => {
      // Find the category-level row (empty segment)
      const categoryRow = rows.find((row) => !row.Segment || row.Segment === "")

      if (categoryRow) {
        // Extract segment rows
        const segmentRows = rows.filter((row) => row.Segment && row.Segment !== "")

        bankingData[category] = {
          current: Number.parseFloat(categoryRow.Current || 0),
          target: Number.parseFloat(categoryRow.Target || 0),
          previousDay: Number.parseFloat(categoryRow.PreviousDay || 0),
          previousMonth: Number.parseFloat(categoryRow.PreviousMonth || 0),
          previousYear: Number.parseFloat(categoryRow.PreviousYear || 0),
          segments: segmentRows.map((row) => ({
            name: row.Segment,
            value: Number.parseFloat(row.Current || 0),
            target: Number.parseFloat(row.Target || 0),
          })),
        }
      }
    })

    return {
      data: bankingData,
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error("Error parsing Excel file:", error)
    throw new Error("Failed to parse Excel file")
  }
}
