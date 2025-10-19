"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Type, Contrast, Volume2, Globe, Check } from "lucide-react"

export default function HogarAjustesPage() {
  const router = useRouter()
  const [textSize, setTextSize] = useState<"normal" | "large">("normal")
  const [contrast, setContrast] = useState<"normal" | "high">("normal")
  const [volume, setVolume] = useState(50)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 text-[#2C3E2F] flex flex-col">
      <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
        <h1 className="text-3xl font-bold text-center">Ajustes</h1>
      </header>

      <main className="flex-1 p-8 space-y-8">
        {/* Text size */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#2C3E2F]/10">
          <div className="flex items-center gap-4 mb-6">
            <Type className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Tamaño de texto</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTextSize("normal")}
              className={`h-20 rounded-2xl text-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                textSize === "normal" ? "bg-[#2C3E2F] text-white" : "bg-[#E5E1D8] text-[#2C3E2F]"
              }`}
            >
              {textSize === "normal" && <Check className="w-6 h-6" />}
              A−
            </button>
            <button
              onClick={() => setTextSize("large")}
              className={`h-20 rounded-2xl text-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                textSize === "large" ? "bg-[#2C3E2F] text-white" : "bg-[#E5E1D8] text-[#2C3E2F]"
              }`}
            >
              {textSize === "large" && <Check className="w-6 h-6" />}
              A+
            </button>
          </div>
        </div>

        {/* Contrast */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#2C3E2F]/10">
          <div className="flex items-center gap-4 mb-6">
            <Contrast className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Contraste</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setContrast("normal")}
              className={`h-20 rounded-2xl text-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                contrast === "normal" ? "bg-[#2C3E2F] text-white" : "bg-[#E5E1D8] text-[#2C3E2F]"
              }`}
            >
              {contrast === "normal" && <Check className="w-6 h-6" />}
              Normal
            </button>
            <button
              onClick={() => setContrast("high")}
              className={`h-20 rounded-2xl text-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                contrast === "high" ? "bg-[#2C3E2F] text-white" : "bg-[#E5E1D8] text-[#2C3E2F]"
              }`}
            >
              {contrast === "high" && <Check className="w-6 h-6" />}
              Alto
            </button>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#2C3E2F]/10">
          <div className="flex items-center gap-4 mb-6">
            <Volume2 className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Volumen</h2>
          </div>
          <div className="space-y-6">
            <div className="w-full h-6 bg-[#E5E1D8] rounded-full overflow-hidden">
              <div className="h-full bg-[#2C3E2F] transition-all" style={{ width: `${volume}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setVolume(Math.max(0, volume - 10))}
                className="h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-3xl font-bold active:scale-95 transition-transform"
              >
                −
              </button>
              <button
                onClick={() => setVolume(Math.min(100, volume + 10))}
                className="h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-3xl font-bold active:scale-95 transition-transform"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#2C3E2F]/10">
          <div className="flex items-center gap-4 mb-6">
            <Globe className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Idioma</h2>
          </div>
          <button className="w-full h-20 bg-[#2C3E2F] text-white rounded-3xl text-xl font-semibold flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            Español
          </button>
        </div>
      </main>

      <div className="p-8">
        <button
          onClick={() => router.push("/hogar")}
          className="w-full h-24 bg-[#2C3E2F] text-white rounded-3xl text-2xl font-bold active:scale-95 transition-transform shadow-xl"
        >
          Listo
        </button>
      </div>
    </div>
  )
}
