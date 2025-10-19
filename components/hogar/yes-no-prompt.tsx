"use client"

import { Check, X } from "lucide-react"

interface YesNoPromptProps {
  question: string
  onYes: () => void
  onNo: () => void
  yesText?: string
  noText?: string
}

export function YesNoPrompt({ question, onYes, onNo, yesText = "Sí", noText = "No" }: YesNoPromptProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-center leading-tight">{question}</h2>

      <div className="space-y-4">
        <button
          onClick={onYes}
          className="w-full h-24 bg-[#4A7C59] text-white rounded-3xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-xl"
        >
          <Check className="w-10 h-10" strokeWidth={3} />
          {yesText}
        </button>

        <button
          onClick={onNo}
          className="w-full h-24 bg-[#E5E1D8] text-[#2C3E2F] rounded-3xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform"
        >
          <X className="w-10 h-10" strokeWidth={3} />
          {noText}
        </button>
      </div>
    </div>
  )
}
