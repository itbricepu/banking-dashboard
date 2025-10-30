"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import CategoryDetail from "@/components/category-detail"
import LoopingDisplay from "@/components/looping-display"
import ExcelFormatGuide from "@/components/excel-format-guide"
import { useBankingData } from "@/hooks/use-banking-data"

type Page = "dashboard" | "category" | "looping" | "format-guide"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { bankingData, lastUpdated, isLoading, error, refetch } = useBankingData()

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage("category")
  }

  const handleBack = () => {
    setCurrentPage("dashboard")
  }

  const handleLooping = () => {
    setCurrentPage("looping")
  }

  const handleViewFormatGuide = () => {
    setCurrentPage("format-guide")
  }

  const handleDataUpdate = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-background">
      {currentPage === "dashboard" && (
        <Dashboard
          bankingData={bankingData}
          onCategoryClick={handleCategoryClick}
          onLooping={handleLooping}
          lastUpdated={lastUpdated}
          onViewFormatGuide={handleViewFormatGuide}
          onDataUpdate={handleDataUpdate}
          isLoading={isLoading}
        />
      )}
      {currentPage === "category" && (
        <CategoryDetail
          category={selectedCategory}
          bankingData={bankingData}
          onBack={handleBack}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
        />
      )}
      {currentPage === "looping" && (
        <LoopingDisplay
          bankingData={bankingData}
          onBack={handleBack}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
        />
      )}
      {currentPage === "format-guide" && (
        <div className="w-full h-screen overflow-y-auto bg-white p-8">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-[#084F8D] text-white rounded-lg hover:bg-[#063A66] transition-colors font-medium"
          >
            ← Back to Dashboard
          </button>
          <ExcelFormatGuide />
        </div>
      )}
    </div>
  )
}
