"use client"

import { useState } from "react"
import { EXCEL_FORMAT_SPECIFICATION, SEGMENT_STRUCTURE } from "@/lib/excel-format-spec"
import { ChevronDown, ChevronUp, Download, AlertCircle } from "lucide-react"

export default function ExcelFormatGuide() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    columns: true,
    rules: false,
    segments: false,
    examples: false,
    inverseLogic: false,
    flatStructure: false,
  })
  const [copiedExample, setCopiedExample] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch("/api/download-template")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "banking-metrics-template.xlsx"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading template:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedExample(true)
    setTimeout(() => setCopiedExample(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#084F8D] mb-2">Excel Format Specification</h2>
          <p className="text-gray-600">Complete guide for preparing your banking metrics data</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-[#F36E23] text-white rounded-lg hover:bg-[#E55A0F] transition-colors font-medium whitespace-nowrap"
        >
          <Download size={18} />
          Download Template
        </button>
      </div>

      {/* Quick Start */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-[#084F8D] mb-2">Quick Start</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Download the template Excel file using the button above</li>
          <li>Fill in your banking metrics data following the column specifications</li>
          <li>Each segment should be a separate row with its category and segment name</li>
          <li>Ensure all required columns are present and properly formatted</li>
          <li>Upload the file using the "Upload Excel" button on the dashboard</li>
          <li>Your data will be automatically processed and displayed</li>
        </ol>
      </div>

      {/* Flat Structure Explanation */}
      <div className="mb-6 border border-blue-200 rounded-lg overflow-hidden bg-blue-50">
        <button
          onClick={() => toggleSection("flatStructure")}
          className="w-full flex items-center justify-between p-4 bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-[#084F8D]" />
            <h3 className="text-lg font-semibold text-[#084F8D]">Flat Excel Structure (Important!)</h3>
          </div>
          {expandedSections.flatStructure ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.flatStructure && (
          <div className="p-4 bg-white space-y-4">
            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">What is Flat Structure?</h4>
              <p className="text-gray-700 text-sm mb-3">
                Instead of storing segment data as nested JSON within a single row, each segment is now stored as a
                separate row in the Excel file. This makes the data more readable, easier to edit, and fully reusable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">How It Works</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Category-Level Row:</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Each category has one row with an empty Segment column containing the category totals.
                  </p>
                  <div className="bg-white p-2 rounded border border-gray-300 text-xs font-mono overflow-x-auto">
                    Category: Pinjaman | Segment: (empty) | Current: 45000000 | Target: 50000000 | ...
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Segment Rows:</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Each segment within a category has its own row with the segment name explicitly shown.
                  </p>
                  <div className="space-y-1">
                    <div className="bg-white p-2 rounded border border-gray-300 text-xs font-mono overflow-x-auto">
                      Category: Pinjaman | Segment: Micro | Current: 12000000 | Target: 15000000 | ...
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-300 text-xs font-mono overflow-x-auto">
                      Category: Pinjaman | Segment: Small | Current: 18000000 | Target: 20000000 | ...
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-300 text-xs font-mono overflow-x-auto">
                      Category: Pinjaman | Segment: Consumer | Current: 15000000 | Target: 15000000 | ...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">Benefits of Flat Structure</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F36E23] font-bold">✓</span>
                  <span className="text-sm text-gray-700">
                    <strong>Readable:</strong> No complex JSON formatting needed
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F36E23] font-bold">✓</span>
                  <span className="text-sm text-gray-700">
                    <strong>Editable:</strong> Easy to modify data directly in Excel
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F36E23] font-bold">✓</span>
                  <span className="text-sm text-gray-700">
                    <strong>Reusable:</strong> Export and re-import data without conversion
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F36E23] font-bold">✓</span>
                  <span className="text-sm text-gray-700">
                    <strong>Consistent:</strong> Same format for both import and export
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 p-3 rounded border border-orange-200">
              <p className="text-sm text-orange-900">
                <strong>Important:</strong> When uploading your Excel file, ensure that each segment is on a separate
                row with the Category and Segment columns properly filled. The system will automatically group them by
                category for processing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Column Specifications */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection("columns")}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#084F8D]">Column Specifications</h3>
          {expandedSections.columns ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.columns && (
          <div className="p-4 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-[#084F8D]">Column Name</th>
                    <th className="text-left py-2 px-3 font-semibold text-[#084F8D]">Required</th>
                    <th className="text-left py-2 px-3 font-semibold text-[#084F8D]">Data Type</th>
                    <th className="text-left py-2 px-3 font-semibold text-[#084F8D]">Description</th>
                    <th className="text-left py-2 px-3 font-semibold text-[#084F8D]">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {EXCEL_FORMAT_SPECIFICATION.columns.map((col, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 font-mono text-[#084F8D] font-semibold">{col.name}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            col.required ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {col.required ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{col.dataType || "Text"}</td>
                      <td className="py-3 px-3 text-gray-600 text-sm">{col.description}</td>
                      <td className="py-3 px-3 font-mono text-xs bg-gray-50 rounded p-2 text-gray-700">
                        {col.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rules and Constraints */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection("rules")}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#084F8D]">Rules & Constraints</h3>
          {expandedSections.rules ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.rules && (
          <div className="p-4 bg-white">
            <ul className="space-y-2">
              {EXCEL_FORMAT_SPECIFICATION.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#F36E23] font-bold mt-1">•</span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Segment Structure */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection("segments")}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#084F8D]">Segment Structure by Category</h3>
          {expandedSections.segments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.segments && (
          <div className="p-4 bg-white space-y-4">
            {Object.entries(SEGMENT_STRUCTURE).map(([category, segments]) => (
              <div key={category} className="border-l-4 border-[#F36E23] pl-4">
                <h4 className="font-semibold text-[#084F8D] mb-2">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {segments.map((segment, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-mono text-[#084F8D] font-semibold">{segment.name}</span>
                      <p className="text-gray-600 text-xs">{segment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Example Data */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection("examples")}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#084F8D]">Example Data Format</h3>
          {expandedSections.examples ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.examples && (
          <div className="p-4 bg-white space-y-4">
            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">Flat Structure Example (Pinjaman Category):</h4>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 text-xs overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">Category</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">Segment</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">Current</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">Target</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">PrevDay</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">PrevMonth</th>
                      <th className="text-left py-2 px-2 font-semibold text-[#084F8D]">PrevYear</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 bg-white">
                      <td className="py-2 px-2">Pinjaman</td>
                      <td className="py-2 px-2">(empty)</td>
                      <td className="py-2 px-2">45000000</td>
                      <td className="py-2 px-2">50000000</td>
                      <td className="py-2 px-2">44500000</td>
                      <td className="py-2 px-2">41500000</td>
                      <td className="py-2 px-2">38900000</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-blue-50">
                      <td className="py-2 px-2">Pinjaman</td>
                      <td className="py-2 px-2">Micro</td>
                      <td className="py-2 px-2">12000000</td>
                      <td className="py-2 px-2">15000000</td>
                      <td className="py-2 px-2">11800000</td>
                      <td className="py-2 px-2">11200000</td>
                      <td className="py-2 px-2">10500000</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-white">
                      <td className="py-2 px-2">Pinjaman</td>
                      <td className="py-2 px-2">Small</td>
                      <td className="py-2 px-2">18000000</td>
                      <td className="py-2 px-2">20000000</td>
                      <td className="py-2 px-2">17900000</td>
                      <td className="py-2 px-2">17100000</td>
                      <td className="py-2 px-2">16200000</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-blue-50">
                      <td className="py-2 px-2">Pinjaman</td>
                      <td className="py-2 px-2">Consumer</td>
                      <td className="py-2 px-2">15000000</td>
                      <td className="py-2 px-2">15000000</td>
                      <td className="py-2 px-2">14800000</td>
                      <td className="py-2 px-2">13200000</td>
                      <td className="py-2 px-2">12200000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Notice: Category-level row has empty Segment, followed by individual segment rows
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Special Achievement Logic: SML & NPL */}
      <div className="mb-6 border border-orange-200 rounded-lg overflow-hidden bg-orange-50">
        <button
          onClick={() => toggleSection("inverseLogic")}
          className="w-full flex items-center justify-between p-4 bg-orange-100 hover:bg-orange-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-[#F36E23]" />
            <h3 className="text-lg font-semibold text-[#084F8D]">Special Achievement Logic: SML & NPL</h3>
          </div>
          {expandedSections.inverseLogic ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSections.inverseLogic && (
          <div className="p-4 bg-white space-y-4">
            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">What is Inverse Achievement Logic?</h4>
              <p className="text-gray-700 text-sm mb-3">
                SML (Special Mention Loan) and NPL (Non-Performing Loan) categories represent credit quality
                deterioration. Unlike other categories where higher values indicate better performance, for SML and NPL,{" "}
                <strong>lower values are better</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">Achievement Calculation</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Normal Categories (Pinjaman, Recovery, Dana Pihak Ketiga):</strong>
                  </p>
                  <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300">
                    Achievement % = (Current Value / RKA Target) × 100
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Higher current value = Better performance</p>
                </div>

                <div className="bg-orange-50 p-3 rounded border border-orange-300">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>SML & NPL Categories (Inverse Logic):</strong>
                  </p>
                  <p className="font-mono text-sm bg-white p-2 rounded border border-orange-300">
                    Achievement % = (RKA Target / Current Value) × 100
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Lower current value = Better performance</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">Example Scenarios</h4>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">SML Category Example:</p>
                  <p className="text-xs text-gray-600">• Current Value: 8,500,000 | RKA Target: 10,000,000</p>
                  <p className="text-xs text-gray-600">
                    • Achievement: (10,000,000 / 8,500,000) × 100 = <strong>117.65%</strong> ✓ Excellent (Blue)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    → Lower SML value than target = Better credit quality = Higher achievement
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">NPL Category Example:</p>
                  <p className="text-xs text-gray-600">• Current Value: 2,100,000 | RKA Target: 1,500,000</p>
                  <p className="text-xs text-gray-600">
                    • Achievement: (1,500,000 / 2,100,000) × 100 = <strong>71.43%</strong> ✗ Poor (Red)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    → Higher NPL value than target = Worse credit quality = Lower achievement
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#084F8D] mb-2">Color Coding Interpretation</h4>
              <p className="text-sm text-gray-700 mb-3">
                The color coding remains the same for all categories, but the interpretation differs:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-xs font-semibold text-red-700 mb-1">Red: &lt; 95%</p>
                  <p className="text-xs text-gray-600">
                    <strong>Normal:</strong> Underperforming
                    <br />
                    <strong>SML/NPL:</strong> Worsening (current too high)
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-xs font-semibold text-yellow-700 mb-1">Yellow: 95-99%</p>
                  <p className="text-xs text-gray-600">
                    <strong>Normal:</strong> Caution
                    <br />
                    <strong>SML/NPL:</strong> Slightly worsening
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-xs font-semibold text-green-700 mb-1">Green: 100-105%</p>
                  <p className="text-xs text-gray-600">
                    <strong>Normal:</strong> Good
                    <br />
                    <strong>SML/NPL:</strong> Good (current lower than target)
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Blue: &gt; 105%</p>
                  <p className="text-xs text-gray-600">
                    <strong>Normal:</strong> Excellent
                    <br />
                    <strong>SML/NPL:</strong> Excellent (current much lower)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Key Takeaway:</strong> When uploading data, ensure your SML and NPL target values represent the
                desired maximum levels. The system will automatically apply inverse logic to calculate achievement
                correctly.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Color Coding Legend */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h4 className="font-semibold text-[#084F8D] mb-3">Achievement Color Coding</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">&lt; 95% (Poor)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-700">95-99% (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">100-105% (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">&gt; 105% (Excellent)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
