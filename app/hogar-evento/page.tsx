"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Phone } from "lucide-react"
import { YesNoPrompt } from "@/components/hogar/yes-no-prompt"

const SAMPLE_EVENTS = [
  {
    emoji: "🎲",
    title: "Bingo del club",
    day: "Sábado 17:00",
    location: "A 5 cuadras",
    description: "Bingo mensual con premios y merienda incluida",
  },
  {
    emoji: "🎵",
    title: "Concierto de tango",
    day: "Domingo 19:00",
    location: "Teatro Municipal",
    description: "Orquesta típica con cantores invitados",
  },
  {
    emoji: "🌳",
    title: "Caminata en el parque",
    day: "Miércoles 10:00",
    location: "Parque Rodó",
    description: "Caminata grupal con desayuno después",
  },
  {
    emoji: "📚",
    title: "Club de lectura",
    day: "Viernes 16:00",
    location: "Biblioteca",
    description: "Charla sobre literatura uruguaya",
  },
]

export default function HogarEventoPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentEvent = SAMPLE_EVENTS[currentIndex]

  const handleYes = () => {
    router.push("/hogar")
  }

  const handleNext = () => {
    if (currentIndex < SAMPLE_EVENTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      router.push("/hogar")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#2C3E2F] flex flex-col">
      <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
        <h1 className="text-3xl font-bold text-center">Evento próximo</h1>
      </header>

      <main className="flex-1 p-8 space-y-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#2C3E2F]/10 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{currentEvent.emoji}</div>
            <h2 className="text-4xl font-bold mb-4">{currentEvent.title}</h2>
            <div className="space-y-3 text-2xl text-[#2C3E2F]/70">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-8 h-8" />
                <span>{currentEvent.day}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-8 h-8" />
                <span>{currentEvent.location}</span>
              </div>
            </div>
          </div>

          <p className="text-xl text-center leading-relaxed text-[#2C3E2F]/80">{currentEvent.description}</p>
        </div>

        <YesNoPrompt
          question="¿Querés ir?"
          onYes={handleYes}
          onNo={handleNext}
          yesText="Sí, quiero ir"
          noText="Siguiente"
        />

        
      </main>
    </div>
  )
}
