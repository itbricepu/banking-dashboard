import type { BankingMetrics } from "./banking-data"

export interface FlatExcelRow {
  Category: string
  Segment: string
  Current: number
  Target: number
  PreviousDay: number
  PreviousMonth: number
  PreviousYear: number
}

// Flatten nested banking data structure to flat rows for Excel export
export function flattenBankingDataForExcel(bankingData: Record<string, BankingMetrics>): FlatExcelRow[] {
  const flatRows: FlatExcelRow[] = []

  Object.entries(bankingData).forEach(([category, metrics]) => {
    // Add category-level row
    flatRows.push({
      Category: category,
      Segment: "",
      Current: metrics.current,
      Target: metrics.target,
      PreviousDay: metrics.previousDay,
      PreviousMonth: metrics.previousMonth,
      PreviousYear: metrics.previousYear,
    })

    // Add segment rows
    metrics.segments.forEach((segment) => {
      flatRows.push({
        Category: category,
        Segment: segment.name,
        Current: segment.value,
        Target: segment.target,
        PreviousDay: 0, // Segments don't have historical data in current structure
        PreviousMonth: 0,
        PreviousYear: 0,
      })
    })
  })

  return flatRows
}
