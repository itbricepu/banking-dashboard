/**
 * Calculates the difference between current and previous values
 * For normal categories: positive difference = improvement
 * For SML/NPL: negative difference = improvement (lower is better)
 */
export function calculateDifference(current: number, previous: number): number {
  return current - previous
}

/**
 * Determines if a difference is positive (improvement) for a given category
 * For normal categories: positive difference = improvement
 * For SML/NPL: negative difference = improvement (lower is better)
 */
export function isDifferencePositive(difference: number, category: string): boolean {
  const isInverseCategory = category === "SML" || category === "NPL"

  if (isInverseCategory) {
    // For SML/NPL: negative difference is positive (improvement)
    return difference < 0
  }

  // For other categories: positive difference is positive (improvement)
  return difference > 0
}

/**
 * Gets color for difference indicator
 * Green for positive improvement, Red for negative/worsening
 */
export function getDifferenceColor(
  difference: number,
  category: string,
): {
  bg: string
  text: string
  border: string
} {
  const isPositive = isDifferencePositive(difference, category)

  if (isPositive) {
    return {
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    }
  }

  return {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  }
}

/**
 * Formats a difference value with appropriate sign
 */
export function formatDifference(difference: number): string {
  const sign = difference >= 0 ? "+" : ""
  return `${sign}${difference.toLocaleString()}`
}
