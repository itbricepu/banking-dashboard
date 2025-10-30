"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BankingMetrics } from "@/lib/banking-data"
import { calculateAchievement, getAchievementColor } from "@/lib/achievement-utils"
import { ArrowRight, Play, Upload, HelpCircle } from "lucide-react"
import { useState, useRef } from "react"

interface DashboardProps {
  bankingData: Record<string, BankingMetrics>
  onCategoryClick: (category: string) => void
  onLooping: () => void
  lastUpdated: Date
  onViewFormatGuide?: () => void
  onDataUpdate?: () => void
  isLoading?: boolean
}

function formatLastUpdated(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function Dashboard({
  bankingData,
  onCategoryClick,
  onLooping,
  lastUpdated,
  onViewFormatGuide,
  onDataUpdate,
  isLoading = false,
}: DashboardProps) {
  const categories = Object.keys(bankingData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Excel data uploaded successfully:", result)
        alert("Excel file uploaded successfully!")
        // Trigger data refetch
        if (onDataUpdate) {
          onDataUpdate()
        }
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload Excel file")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading banking data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col p-8 bg-white dark:bg-slate-950">
      {/* Header with Last Updated */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Banking Performance Dashboard</h1>
          <p className="text-muted-foreground text-lg">Achievement Data Overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="text-lg font-semibold text-primary">{formatLastUpdated(lastUpdated)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {categories.map((category) => {
            const data = bankingData[category]
            const achievement = calculateAchievement(data.current, data.target, category)
            const colors = getAchievementColor(achievement)

            return (
              <Card
                key={category}
                className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-slate-800 border-2 ${colors.border}`}
                onClick={() => onCategoryClick(category)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-primary">{category}</h2>
                  <ArrowRight className="w-5 h-5 text-secondary" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl font-bold text-foreground">{data.current.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">RKA Target</p>
                    <p className="text-lg font-semibold text-foreground">{data.target.toLocaleString()}</p>
                  </div>

                  <div className={`pt-3 border-t-2 ${colors.border} rounded-lg p-3 ${colors.bg}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Achievement</span>
                      <span className={`text-lg font-bold ${colors.text}`}>{achievement}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all 
                          ${
                          achievement >= 105 ? 'bg-blue-500' : 
                          achievement >= 100 ? 'bg-green-500' : 
                          achievement >= 75 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }
              `}
                        style={{ width: `${Math.min(achievement, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer with Buttons */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-primary/20 gap-4">
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Excel"}
          </Button>
          <Button
            onClick={onViewFormatGuide}
            className="flex items-center gap-2 bg-[#F36E23] hover:bg-[#E55A0F] text-white font-semibold rounded-lg"
          >
            <HelpCircle className="w-4 h-4" />
            Format Guide
          </Button>
        </div>

        <Button
          onClick={onLooping}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg"
        >
          <Play className="w-4 h-4" />
          Full-Screen Looping View
        </Button>
      </div>
    </div>
  )
}
