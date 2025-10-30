import { useState, useEffect, useCallback } from "react"
import type { BankingMetrics } from "@/lib/banking-data"

interface BankingData {
  data: Record<string, BankingMetrics>
  lastUpdated: string
}

interface UseBankingDataReturn {
  bankingData: Record<string, BankingMetrics>
  lastUpdated: Date
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useBankingData(): UseBankingDataReturn {
  const [bankingData, setBankingData] = useState<Record<string, BankingMetrics>>({})
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/banking-data")
      
      if (!response.ok) {
        throw new Error("Failed to fetch banking data")
      }
      
      const result: BankingData = await response.json()
      setBankingData(result.data)
      setLastUpdated(new Date(result.lastUpdated))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("Error fetching banking data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    bankingData,
    lastUpdated,
    isLoading,
    error,
    refetch: fetchData,
  }
}
