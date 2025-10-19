"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Youtube, Loader2, RefreshCw, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { extractYouTubeId } from "@/lib/youtube"

interface ElderProfile {
  name: string
  age: string
  interests: string
  mobility: string
  schedule: string
  preferences: string
  recommendations?: string
  createdAt: string
}

interface GeneratedContent {
  videos: Array<{
    title: string
    channel?: string
    duration?: string
    reason?: string
    url: string
    thumbnail?: string
  }>
  podcasts: Array<{
    title: string
    host: string
    duration: string
    reason: string
    platform: string
    albumArt: string
  }>
  events: Array<{
    title: string
    location: string
    date: string
    time: string
    reason: string
    type: string
    locationImage: string
  }>
}

export default function InicioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn, role, profileId, isLoading: authLoading } = useAuth({ requireAuth: true })
  const [hydrated, setHydrated] = useState(false)
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState<ElderProfile | null>(null)
  const [isReformulating, setIsReformulating] = useState(false)
  const [activitySummary, setActivitySummary] = useState({
    liked: 0,
    disliked: 0,
    notViewed: 0,
    total: 0,
  })

  const handleSaveProfile = () => {
    if (!editedProfile) return
    setProfile(editedProfile)
    localStorage.setItem("elderProfile", JSON.stringify(editedProfile))
    setIsEditingProfile(false)
    toast({
      title: "Perfil actualizado",
      description: "La información del perfil se ha guardado correctamente",
    })
  }

  useEffect(() => {
    console.log("[v0] InicioPage mounted, setting hydrated to true")
    setHydrated(true)
  }, [])

  useEffect(() => {
    console.log("[v0] Main useEffect triggered - hydrated:", hydrated, "authLoading:", authLoading)

    if (!hydrated || authLoading) {
      console.log("[v0] Skipping main useEffect - waiting for hydration or auth")
      return
    }

    console.log("[v0] Reading elderProfile from localStorage")
    const storedProfile = localStorage.getItem("elderProfile")

    if (!storedProfile) {
      console.log("[v0] No elderProfile found, redirecting to onboarding")
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    console.log("[v0] Elder profile loaded:", parsedProfile.name)
    setProfile(parsedProfile)

    console.log("[v0] Reading generatedContent from localStorage")
    const storedContent = localStorage.getItem("generatedContent")

    if (storedContent) {
      console.log("[v0] Found stored content, parsing...")
      const parsedContent = JSON.parse(storedContent)
      console.log(
        "[v0] Stored content parsed - Videos:",
        parsedContent.videos?.length,
        "Podcasts:",
        parsedContent.podcasts?.length,
      )
      setContent(parsedContent)
      calculateActivitySummary(parsedContent)
      setIsLoading(false)
    } else {
      console.log("[v0] No stored content found, calling generateContent")
      generateContent(parsedProfile)
    }
  }, [hydrated, authLoading, router])

  const calculateActivitySummary = (contentData: GeneratedContent) => {
    const allContent = [...(contentData.videos || []), ...(contentData.podcasts || []), ...(contentData.events || [])]
    const feedback = JSON.parse(localStorage.getItem("contentFeedback") || "{}")

    let liked = 0
    let disliked = 0
    let notViewed = 0

    allContent.forEach((item, index) => {
      const key = `${item.title}-${index}`
      if (feedback[key]?.viewed) {
        if (feedback[key]?.liked === true) liked++
        else if (feedback[key]?.liked === false) disliked++
      } else {
        notViewed++
      }
    })

    setActivitySummary({
      liked,
      disliked,
      notViewed,
      total: allContent.length,
    })
  }

  const generateContent = async (profileData: ElderProfile) => {
    console.log("[v0] === generateContent START ===")
    setIsLoading(true)

    try {
      const credencialId = localStorage.getItem("credencial_id") || "1"
      console.log(`[v0] Using credencial_id: ${credencialId}`)
      console.log(`[v0] Calling API: /api/proxy/list-content/${credencialId}`)

      const response = await fetch(`/api/proxy/list-content/${credencialId}`)
      console.log(`[v0] API response status: ${response.status}`)

      if (!response.ok) {
        console.error(`[v0] API response not OK: ${response.status} ${response.statusText}`)
        throw new Error("Failed to fetch content from backend")
      }

      const backendContent = await response.json()
      console.log(`[v0] Backend content received - Array length: ${backendContent.length}`)
      console.log(`[v0] First item:`, backendContent[0])

      const transformedContent: GeneratedContent = {
        videos: backendContent
          .filter((item: any) => item.plataforma === "YouTube")
          .map((item: any) => {
            const videoId = extractYouTubeId(item.url)
            console.log(`[v0] Processing video: ${item.titulo}, videoId: ${videoId}`)
            return {
              title: item.titulo,
              channel: "YouTube",
              duration: "",
              reason: `Contenido personalizado para ${profileData.name}`,
              url: item.url,
              thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "",
            }
          }),
        podcasts: backendContent
          .filter((item: any) => item.plataforma === "Spotify")
          .map((item: any) => ({
            title: item.titulo,
            host: "Spotify",
            duration: "",
            reason: `Contenido personalizado para ${profileData.name}`,
            platform: "Spotify",
            albumArt: "/placeholder.svg",
          })),
        events: [],
      }

      console.log(
        `[v0] Transformed content - Videos: ${transformedContent.videos.length}, Podcasts: ${transformedContent.podcasts.length}`,
      )
      console.log(`[v0] Saving to localStorage and updating state`)

      setContent(transformedContent)
      localStorage.setItem("generatedContent", JSON.stringify(transformedContent))
      calculateActivitySummary(transformedContent)
      setIsLoading(false)

      console.log("[v0] === generateContent SUCCESS ===")
    } catch (error) {
      console.error("[v0] === generateContent ERROR ===")
      console.error("[v0] Error details:", error)

      const fallbackContent: GeneratedContent = {
        videos: [
          {
            title: "Historia del tango argentino - Documental completo",
            channel: "Historia Argentina",
            duration: "45:20",
            reason: `Basado en el interés de ${profileData.name} en la historia y la música`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          },
          {
            title: "Recetas tradicionales uruguayas paso a paso",
            channel: "Cocina del Río de la Plata",
            duration: "28:15",
            reason: "Contenido sobre cocina tradicional de la región",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          },
          {
            title: "Mejores jugadas de Peñarol - Clásicos históricos",
            channel: "Fútbol Uruguayo",
            duration: "35:40",
            reason: `Contenido deportivo relacionado con los intereses de ${profileData.name}`,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          },
        ],
        podcasts: [
          {
            title: "Historias del Río de la Plata",
            host: "Radio Nacional",
            duration: "42 min",
            reason: "Podcast sobre historia regional",
            platform: "Spotify",
            albumArt: "/placeholder.svg",
          },
          {
            title: "Música de nuestra tierra",
            host: "Folklore y Tradición",
            duration: "38 min",
            reason: "Contenido musical tradicional",
            platform: "Spotify",
            albumArt: "/placeholder.svg",
          },
          {
            title: "Charlas de café - Historias de vida",
            host: "Conversaciones",
            duration: "50 min",
            reason: "Podcast conversacional sobre experiencias de vida",
            platform: "Spotify",
            albumArt: "/placeholder.svg",
          },
        ],
        events: [
          {
            title: "Misa dominical",
            location: "Parroquia del barrio",
            date: "Domingo 20 Oct",
            time: "10:00",
            reason: "Actividad religiosa semanal",
            type: "Religioso",
            locationImage: "/placeholder.svg",
          },
          {
            title: "Bingo comunitario",
            location: "Centro de jubilados",
            date: "Miércoles 23 Oct",
            time: "15:00",
            reason: "Actividad social recreativa",
            type: "Social",
            locationImage: "/placeholder.svg",
          },
          {
            title: "Taller de tejido",
            location: "Club del barrio",
            date: "Jueves 24 Oct",
            time: "16:00",
            reason: "Actividad manual y social",
            type: "Taller",
            locationImage: "/placeholder.svg",
          },
        ],
      }

      setContent(fallbackContent)
      localStorage.setItem("generatedContent", JSON.stringify(fallbackContent))
      calculateActivitySummary(fallbackContent)
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!profile) return
    setIsRegenerating(true)
    await generateContent(profile)
    const storedContent = localStorage.getItem("generatedContent")
    if (storedContent) {
      setContent(JSON.parse(storedContent))
    }
    setIsRegenerating(false)
  }

  const handlePersonalize = () => {
    router.push("/personalizar")
  }

  const handleRemoveContent = (type: "videos" | "podcasts" | "events", index: number) => {
    if (!content) return

    const updatedContent = { ...content }
    updatedContent[type] = updatedContent[type].filter((_, i) => i !== index)

    setContent(updatedContent)
    localStorage.setItem("generatedContent", JSON.stringify(updatedContent))
    calculateActivitySummary(updatedContent)
  }

  const handleStartEdit = () => {
    setEditedProfile(profile)
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setEditedProfile(null)
    setIsEditingProfile(false)
  }

  const handleReformulate = async () => {
    setIsReformulating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Descripción reformulada",
      description: "La descripción se ha actualizado basándose en el feedback del contenido reproducido",
    })

    setIsReformulating(false)
  }

  console.log(
    "[v0] Rendering InicioPage - isLoading:",
    isLoading,
    "content:",
    content ? "exists" : "null",
    "videos:",
    content?.videos?.length,
  )

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader elderName={profile?.name || "Cargando..."} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Generando contenido personalizado...</p>
          </div>
        </div>
      </div>
    )
  }
  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando contenido...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName={profile?.name || "Inicio"} />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-6xl px-4 py-6">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Contenido personalizado</h1>
                <p className="text-muted-foreground">Generado con IA para {profile?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating} size="lg">
                  {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button onClick={() => router.push("/personalizar")} size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar intereses
                </Button>
              </div>
            </div>

            {content?.videos && content.videos.length > 0 && (
              <section className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Youtube className="h-6 w-6 text-red-600" />
                  <h2 className="text-xl font-semibold">Videos de YouTube</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.videos.map((video, index) => {
                    const videoId = extractYouTubeId(video.url)

                    return (
                      <button
                        key={`video-${index}`}
                        onClick={() => {
                          if (videoId) {
                            router.push(`/video-player?videoId=${videoId}&title=${encodeURIComponent(video.title)}`)
                          }
                        }}
                        className="relative group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-6 text-left hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-red-200 dark:border-red-800"
                      >
                        <div className="absolute top-3 right-3 bg-red-600 rounded-full p-2 group-hover:scale-110 transition-transform">
                          <Youtube className="h-5 w-5 text-white" />
                        </div>

                        <h3 className="font-semibold text-base line-clamp-3 pr-12 mb-2">{video.title}</h3>

                        {video.channel && <p className="text-sm text-muted-foreground mb-2">{video.channel}</p>}

                        {video.duration && <p className="text-xs text-muted-foreground">{video.duration}</p>}

                        <div className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">Click para ver →</div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="h-10 w-10 text-primary mb-3" />
                <h3 className="text-lg font-semibold mb-2">¿Querés buscar más contenido?</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Explorá nuestra biblioteca completa de contenido personalizado
                </p>
                <Button onClick={() => router.push("/descubrir")}>Descubrir más contenido</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
