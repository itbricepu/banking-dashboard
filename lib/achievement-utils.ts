export interface AchievementColors {
  bg: string
  text: string
  border: string
  glow?: string
}

/**
 * Determines if a category uses inverse achievement logic
 * SML (Special Mention Loan) and NPL (Non-Performing Loan) are credit quality metrics
 * where LOWER values indicate BETTER performance
 */
function isInverseCategory(category: string): boolean {
  return category === "SML" || category === "NPL"
}

/**
 * Calculates achievement percentage with support for inverse logic
 * For normal categories: (current / target) * 100
 * For SML/NPL: (target / current) * 100 (inverse - lower is better)
 */
export function calculateAchievement(current: number, target: number, category: string): number {
  if (isInverseCategory(category)) {
    // For SML/NPL: target / current (lower current = higher achievement)
    return Number.parseFloat(((target / current) * 100).toFixed(2))
  }
  // For other categories: current / target (higher current = higher achievement)
  return Number.parseFloat(((current / target) * 100).toFixed(2))
}

/**
 * Returns color scheme based on achievement percentage
 * Supports both normal and inverse categories
 * Red: <95% (poor), Yellow: 95-99% (caution), Green: 100-105% (good), Blue: >105% (excellent)
 */
export function getAchievementColor(achievement: number, includeGlow = false): AchievementColors {
  const baseColors = {
    red: {
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      glow: "from-red-500/20",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
      glow: "from-yellow-500/20",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      glow: "from-green-500/20",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      glow: "from-blue-500/20",
    },
  }

  const darkModeColors = {
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/50",
      glow: "from-red-500/20",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/50",
      glow: "from-yellow-500/20",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/50",
      glow: "from-green-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/50",
      glow: "from-blue-500/20",
    },
  }

  let colorKey: "red" | "yellow" | "green" | "blue"

  if (achievement < 95) {
    colorKey = "red"
  } else if (achievement < 100) {
    colorKey = "yellow"
  } else if (achievement <= 105) {
    colorKey = "green"
  } else {
    colorKey = "blue"
  }

  const colors = includeGlow ? darkModeColors[colorKey] : baseColors[colorKey]

  return {
    bg: colors.bg,
    text: colors.text,
    border: colors.border,
    ...(includeGlow && { glow: colors.glow }),
  }
}
