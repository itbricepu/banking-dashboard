"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, AlertCircle, CheckCircle, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadSectionProps {
  onDataUpdate?: (data: any) => void
}

export default function UploadSection({ onDataUpdate }: UploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setMessage({ type: "error", text: "Please upload an Excel file (.xlsx or .xls)" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()
      setMessage({ type: "success", text: "Excel file uploaded successfully! Data updated." })
      onDataUpdate?.(result)

      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Upload failed" })
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#084F8D]">Upload Banking Data</h3>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="text-sm text-[#F36E23] hover:text-[#E55A0F] font-medium underline"
        >
          {showGuide ? "Hide Format Guide" : "View Format Guide"}
        </button>
      </div>

      {showGuide && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            Your Excel file must contain the following columns:{" "}
            <span className="font-mono font-semibold">
              Category, Current, Target, DayToDay, MonthToDate, YearToDate, Segments
            </span>
          </p>
          <a
            href="/api/download-template"
            className="inline-flex items-center gap-2 text-sm text-[#F36E23] hover:text-[#E55A0F] font-medium"
          >
            <Download size={16} className="text-[#F36E23]" />
            Download Template Excel File
          </a>
        </div>
      )}

      <div
        className="border-2 border-dashed border-[#084F8D] rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} className="mx-auto mb-2 text-[#084F8D]" />
        <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500">Excel files (.xlsx, .xls)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-red-600" />
          )}
          <p className={message.type === "success" ? "text-green-700" : "text-red-700"}>{message.text}</p>
        </div>
      )}

      {isLoading && <p className="text-center text-gray-600">Uploading and processing file...</p>}
    </div>
  )
}
