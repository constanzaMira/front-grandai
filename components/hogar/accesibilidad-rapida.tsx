"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Type, Contrast } from "lucide-react"

export function AccesibilidadRapida() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* FAB button */}
      null

      {/* Quick menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed top-24 right-6 bg-white rounded-2xl shadow-2xl p-4 space-y-3 z-50 border-2 border-[#2C3E2F]/10">
            <button
              onClick={() => router.push("/hogar-ajustes")}
              className="w-48 h-16 bg-[#E5E1D8] text-[#2C3E2F] rounded-xl text-lg font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Type className="w-6 h-6" />
              Tamaño
            </button>
            <button
              onClick={() => router.push("/hogar-ajustes")}
              className="w-48 h-16 bg-[#E5E1D8] text-[#2C3E2F] rounded-xl text-lg font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Contrast className="w-6 h-6" />
              Contraste
            </button>
          </div>
        </>
      )}
    </>
  )
}
