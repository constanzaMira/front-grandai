"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { AppHeader } from "@/components/app-header"

function VideoPlayerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoId = searchParams.get("videoId")
  const title = searchParams.get("title") || "Video"

  if (!videoId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <p className="text-xl text-muted-foreground mb-4">No se encontró el video</p>
        <button
          onClick={() => router.push("/inicio")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader elderName={title} />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* YouTube embed */}
        <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
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

        <p className="text-lg text-center text-muted-foreground mt-6 max-w-2xl">
          El video se está reproduciendo. Usá los controles del video para pausar o ajustar el volumen.
        </p>
      </main>

      <div className="p-6">
        <button
          onClick={() => router.push("/inicio")}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default function VideoPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-xl">Cargando video...</p>
        </div>
      }
    >
      <VideoPlayerContent />
    </Suspense>
  )
}
