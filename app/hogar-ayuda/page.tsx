"use client"

import { useRouter } from "next/navigation"
import { Phone, AlertCircle, Home } from "lucide-react"

export default function HogarAyudaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#2C3E2F] flex flex-col">
      <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
        <h1 className="text-3xl font-bold text-center">Ayuda</h1>
      </header>

      <main className="flex-1 p-8 flex flex-col justify-center space-y-6">
        <p className="text-2xl text-center leading-relaxed mb-8 text-[#2C3E2F]/80">Estamos para ayudarte</p>

        <button
          onClick={() => {}}
          className="w-full h-24 bg-[#2C3E2F] text-white rounded-3xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-xl"
        >
          <Phone className="w-10 h-10" />
          Llamar a la familia
        </button>

        <button
          onClick={() => {}}
          className="w-full h-24 bg-[#D97757] text-white rounded-3xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-xl"
        >
          <AlertCircle className="w-10 h-10" />
          Necesito ayuda
        </button>

        <button
          onClick={() => router.push("/hogar")}
          className="w-full h-24 bg-[#E5E1D8] text-[#2C3E2F] rounded-3xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform"
        >
          <Home className="w-10 h-10" />
          Volver al inicio
        </button>
      </main>
    </div>
  )
}
