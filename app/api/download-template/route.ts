import { generateExcelTemplate } from "@/lib/excel-format-spec"

export async function GET() {
  try {
    const XLSX = await import("xlsx")
    const template = generateExcelTemplate()

    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(template.sampleData)

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 20 }, // Category
      { wch: 15 }, // Current
      { wch: 15 }, // Target
      { wch: 12 }, // DayToDay
      { wch: 15 }, // MonthToDate
      { wch: 15 }, // YearToDate
      { wch: 50 }, // Segments
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Banking Metrics")

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="banking-metrics-template.xlsx"',
      },
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return new Response("Failed to generate template", { status: 500 })
  }
}
