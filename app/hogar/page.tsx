"use client"

import { useRouter } from "next/navigation"
import { Play, Calendar, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { AccesibilidadRapida } from "@/components/hogar/accesibilidad-rapida"
import { extractYouTubeId } from "@/lib/youtube"
import { extractSpotifyTrackId } from "@/lib/spotify"

const CONTENT_ITEMS = [
  {
    type: "Podcast",
    title: "Historias del 900",
    duration: "18 minutos",
    action: "Empezar ahora",
    podcastId: "6pOHgLCS6WkkugeEFZwaIs", // Updated to use real Spotify episode ID from provided URL
    plataforma: "Spotify",
  },
  {
    type: "Video",
    title: "Tango en el Río de la Plata",
    duration: "25 minutos",
    action: "Ver ahora",
    videoId: "dQw4w9WgXcQ",
    plataforma: "YouTube",
  },
  {
    type: "Podcast",
    title: "Recetas de la abuela",
    duration: "15 minutos",
    action: "Escuchar ahora",
    podcastId: "4rOoJ6Egrf8K2IrywzwOMk", // Example Spotify episode ID
    plataforma: "Spotify",
  },
  {
    type: "Video",
    title: "Fútbol: Clásicos memorables",
    duration: "30 minutos",
    action: "Ver ahora",
    videoId: "jNQXAC9IVRw",
    plataforma: "YouTube",
  },
]

export default function HogarPage() {
  const router = useRouter()
  const [logoTouchStart, setLogoTouchStart] = useState<number | null>(null)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [backendContent, setBackendContent] = useState<any[]>([])
  const [useBackendContent, setUseBackendContent] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      console.log("[v0] Fetching content from backend GET endpoint")
      setLoading(true)
      try {
        const response = await fetch("/api/proxy/list-content/1")

        if (!response.ok) {
          console.error("[v0] Failed to fetch content:", response.status)
          throw new Error("Failed to fetch content")
        }

        const data = await response.json()
        console.log("[v0] Backend GET response:", data)

        if (Array.isArray(data) && data.length > 0) {
          setBackendContent(data)
          setUseBackendContent(true)
          console.log("[v0] Using backend content with", data.length, "items")
        } else {
          console.log("[v0] Backend content is empty, using fallback")
          setUseBackendContent(false)
        }
      } catch (error) {
        console.error("[v0] Error fetching content:", error)
        console.log("[v0] Using fallback content")
        setUseBackendContent(false)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const contentToUse = useBackendContent ? backendContent : CONTENT_ITEMS
  const currentContent = useBackendContent ? backendContent[currentContentIndex] : CONTENT_ITEMS[currentContentIndex]

  const handleNextContent = () => {
    setCurrentContentIndex((prev) => (prev + 1) % contentToUse.length)
  }

  const handleLogoTouchStart = () => {
    setLogoTouchStart(Date.now())
  }

  const handleLogoTouchEnd = () => {
    if (logoTouchStart && Date.now() - logoTouchStart >= 2000) {
      router.push("/role")
    }
    setLogoTouchStart(null)
  }

  const handlePlay = () => {
    if (useBackendContent && currentContent) {
      const platform = currentContent.plataforma || "YouTube"

      if (platform === "YouTube") {
        const videoId = extractYouTubeId(currentContent.url)
        if (videoId) {
          console.log("[v0] Navigating to YouTube video:", videoId)
          router.push(`/hogar-player?videoId=${videoId}`)
        } else {
          console.error("[v0] Could not extract video ID from URL:", currentContent.url)
          window.open(currentContent.url, "_blank")
        }
       } else if (platform === "Spotify") {
        if (currentContent.url) {
          console.log("[v0] Navigating to Spotify embed URL:", currentContent.url)
          // 🔹 Pasamos la URL embebida directamente al reproductor
          router.push(`/hogar-player?spotifyUrl=${encodeURIComponent(currentContent.url)}`)
        } else {
          console.error("[v0] No Spotify URL found for content:", currentContent)
        }
      }
    } else if (currentContent.type === "Video" && "videoId" in currentContent) {
      router.push(`/hogar-player?videoId=${currentContent.videoId}`)
    } else if (currentContent.type === "Podcast" && "podcastId" in currentContent) {
      router.push(`/hogar-player?spotifyUrl=${encodeURIComponent(`https://open.spotify.com/embed/episode/${currentContent.podcastId}`)}`)
    } else {
      router.push("/hogar-player")
    }
  }

  const displayTitle = useBackendContent
    ? currentContent?.titulo || "Sin título"
    : `${currentContent.type}: ${currentContent.title}`

  const displaySubtitle = useBackendContent
    ? currentContent?.plataforma === "Spotify"
      ? "Podcast de Spotify"
      : "Video de YouTube"
    : `${currentContent.duration} · ${currentContent.action}`

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2C3E2F] mx-auto mb-4"></div>
          <p className="text-2xl text-[#2C3E2F]">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 text-[#2C3E2F]">
      <main className="p-6 space-y-6 pb-32">
        {/* Ahora card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#2C3E2F]/10">
          <h2 className="text-3xl font-bold mb-3 leading-tight">{displayTitle}</h2>
          <p className="text-2xl text-[#2C3E2F]/70 mb-6">{displaySubtitle}</p>

          <div className="space-y-4">
            <button
              onClick={handlePlay}
              className="w-full h-20 bg-[#2C3E2F] text-white rounded-2xl text-2xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-lg"
            >
              <Play className="w-10 h-10" fill="white" />
              Reproducir
            </button>
            {contentToUse.length > 1 && (
              <button
                onClick={handleNextContent}
                className="w-full h-20 bg-[#E5E1D8] text-[#2C3E2F] rounded-2xl text-2xl font-semibold active:scale-95 transition-transform"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>

        {/* Próximo card */}

        <button
          onClick={() => router.push("/hogar-evento")}
          className="w-full bg-white rounded-2xl p-8 shadow-lg border-2 border-[#2C3E2F]/10 active:scale-95 transition-transform text-left"
        >
          <h3 className="text-4xl font-bold text-[#2C3E2F] text-center">Ver eventos y actividades</h3>
        </button>

        <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF4D6] rounded-2xl p-6 shadow-md border-2 border-[#E8B923]/30">
          <div className="flex items-start gap-4">
            <div className="bg-[#E8B923]/20 rounded-full p-3 flex-shrink-0">
              <Bell className="w-8 h-8 text-[#E8B923]" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold text-[#2C3E2F] mb-1">Próximamente</p>
              <h4 className="text-2xl font-bold text-[#2C3E2F] mb-2">Bingo del club</h4>
              <div className="flex items-center gap-2 text-xl text-[#2C3E2F]/70">
                <Calendar className="w-6 h-6" />
                <span>En 2 días · Sábado 17:00</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AccesibilidadRapida />
    </div>
  )
}
