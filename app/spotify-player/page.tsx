"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function SpotifyPlayerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const trackUrl = searchParams.get("trackUrl")
  const title = searchParams.get("title")
  const artist = searchParams.get("artist")

  if (!trackUrl) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No se proporcionó una URL de Spotify</p>
      </div>
    )
  }

  // Extract Spotify track ID from URL
  const trackId = trackUrl.split("/track/")[1]?.split("?")[0]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center gap-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{title || "Reproduciendo en Spotify"}</h1>
            {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {trackId ? (
            <iframe
              src={`https://open.spotify.com/embed/track/${trackId}`}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No se pudo cargar el reproductor de Spotify</p>
              <Button onClick={() => window.open(trackUrl, "_blank")}>Abrir en Spotify</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SpotifyPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Cargando reproductor...</p>
        </div>
      }
    >
      <SpotifyPlayerContent />
    </Suspense>
  )
}
