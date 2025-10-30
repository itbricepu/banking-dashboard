import ExcelFormatGuide from "@/components/excel-format-guide"
import Link from "next/link"

export default function FormatGuidePage() {
  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#084F8D] text-white rounded-lg hover:bg-[#063A66] transition-colors font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
      <ExcelFormatGuide />
    </div>
  )
}
