"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Play, Pause, Volume2, VolumeX, ArrowLeft } from "lucide-react"
import { useState, Suspense } from "react"

function HogarPlayerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoId = searchParams.get("videoId")
  const podcastId = searchParams.get("podcastId")
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(35)

  if (podcastId) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] text-[#2C3E2F] flex flex-col">
        <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
          <h1 className="text-3xl font-bold text-center">Reproduciendo podcast</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              style={{ borderRadius: "12px" }}
              src={`https://open.spotify.com/embed/episode/${podcastId}?utm_source=generator`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>

          <p className="text-2xl text-center text-[#2C3E2F]/70 leading-relaxed mt-8 max-w-2xl">
            El podcast se está reproduciendo. Usá los controles de Spotify para pausar o ajustar el volumen.
          </p>
        </main>

        <div className="p-6">
          <button
            onClick={() => router.push("/hogar")}
            className="w-full h-20 bg-[#2C3E2F] text-white rounded-2xl text-2xl font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
          >
            <ArrowLeft className="w-8 h-8" />
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (videoId) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] text-[#2C3E2F] flex flex-col">
        <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
          <h1 className="text-3xl font-bold text-center">Reproduciendo video</h1>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          {/* YouTube embed */}
          <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <p className="text-2xl text-center text-[#2C3E2F]/70 leading-relaxed mt-8 max-w-2xl">
            El video se está reproduciendo. Usá los controles del video para pausar o ajustar el volumen.
          </p>
        </main>

        <div className="p-6">
          <button
            onClick={() => router.push("/hogar")}
            className="w-full h-20 bg-[#2C3E2F] text-white rounded-2xl text-2xl font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
          >
            <ArrowLeft className="w-8 h-8" />
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#2C3E2F] flex flex-col">
      <header className="bg-white border-b-2 border-[#2C3E2F]/10 p-6">
        <h1 className="text-3xl font-bold text-center">Reproduciendo</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        {/* Cover image */}
        <div className="w-full max-w-md aspect-square bg-[#E5E1D8] rounded-3xl flex items-center justify-center shadow-xl border-2 border-[#2C3E2F]/10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎙️</div>
            <h2 className="text-2xl font-bold">Historias del 900</h2>
          </div>
        </div>

        {/* Giant controls */}
        <div className="w-full max-w-md space-y-6">
          {/* Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full h-28 bg-[#2C3E2F] text-white rounded-3xl text-3xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-2xl"
          >
            {isPlaying ? (
              <>
                <Pause className="w-12 h-12" fill="white" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-12 h-12" fill="white" />
                Reproducir
              </>
            )}
          </button>

          {/* Volume controls */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {}}
              className="h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <VolumeX className="w-8 h-8" />
              Vol −
            </button>
            <button
              onClick={() => {}}
              className="h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-xl font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Volume2 className="w-8 h-8" />
              Vol +
            </button>
          </div>

          {/* Help text */}
          <p className="text-xl text-center text-[#2C3E2F]/70 leading-relaxed">
            Para pausar, tocá el botón grande del centro
          </p>
        </div>
      </main>

      <div className="bg-white border-t-2 border-[#2C3E2F]/10 p-6 space-y-4">
        <div className="w-full h-4 bg-[#E5E1D8] rounded-full overflow-hidden">
          <div className="h-full bg-[#2C3E2F] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xl font-semibold">
          <span>6 min</span>
          <span>18 min</span>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={() => router.push("/hogar")}
          className="w-full h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-2xl font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-8 h-8" />
          Terminar
        </button>
      </div>
    </div>
  )
}

export default function HogarPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
          <p className="text-2xl">Cargando...</p>
        </div>
      }
    >
      <HogarPlayerContent />
    </Suspense>
  )
}
