"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Youtube, Music, Calendar, Loader2, RefreshCw, X, Plus, Edit, Save, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

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
    setHydrated(true)
  }, [])

  useEffect(() => {
    // Esperar a que la autenticación esté lista y la app esté hidratada
    if (!hydrated || authLoading) return

    console.log("[v0] Inicio page mounted")
    const storedProfile = localStorage.getItem("elderProfile")
    console.log("[v0] Stored profile:", storedProfile)

    if (!storedProfile) {
      console.log("[v0] No profile found, redirecting to onboarding")
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    console.log("[v0] Parsed profile:", parsedProfile)
    setProfile(parsedProfile)

    const storedContent = localStorage.getItem("generatedContent")
    console.log("[v0] Stored content:", storedContent)

    if (storedContent) {
      const parsedContent = JSON.parse(storedContent)
      console.log("[v0] Parsed content:", parsedContent)
      setContent(parsedContent) // 👈 Se ejecuta correctamente ahora
      calculateActivitySummary(parsedContent)
      setIsLoading(false)
    } else {
      console.log("[v0] No content found, generating...")
      generateContent(parsedProfile)
    }
  }, [hydrated, authLoading]) // 👈 eliminá router de las dependencias

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
    console.log("[v0] generateContent called with profile:", profileData)
    setIsLoading(true)

    const fallbackContent: GeneratedContent = {
      videos: [
        {
          title: "Historia del tango argentino - Documental completo",
          channel: "Historia Argentina",
          duration: "45:20",
          reason: `Basado en el interés de ${profileData.name} en la historia y la música`,
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "/tango-argentino-dancers.jpg",
        },
        {
          title: "Recetas tradicionales uruguayas paso a paso",
          channel: "Cocina del Río de la Plata",
          duration: "28:15",
          reason: "Contenido sobre cocina tradicional de la región",
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "/uruguayan-traditional-food.jpg",
        },
        {
          title: "Mejores jugadas de Peñarol - Clásicos históricos",
          channel: "Fútbol Uruguayo",
          duration: "35:40",
          reason: `Contenido deportivo relacionado con los intereses de ${profileData.name}`,
          url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnail: "/penarol-football-stadium.jpg",
        },
      ],
      podcasts: [
        {
          title: "Historias del Río de la Plata",
          host: "Radio Nacional",
          duration: "42 min",
          reason: "Podcast sobre historia regional",
          platform: "Spotify",
          albumArt: "/rio-de-la-plata-history.jpg",
        },
        {
          title: "Música de nuestra tierra",
          host: "Folklore y Tradición",
          duration: "38 min",
          reason: "Contenido musical tradicional",
          platform: "Spotify",
          albumArt: "/folklore-music-album.jpg",
        },
        {
          title: "Charlas de café - Historias de vida",
          host: "Conversaciones",
          duration: "50 min",
          reason: "Podcast conversacional sobre experiencias de vida",
          platform: "Spotify",
          albumArt: "/coffee-conversation-podcast.jpg",
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
          locationImage: "/grand-church-interior.png",
        },
        {
          title: "Bingo comunitario",
          location: "Centro de jubilados",
          date: "Miércoles 23 Oct",
          time: "15:00",
          reason: "Actividad social recreativa",
          type: "Social",
          locationImage: "/community-center-bingo.jpg",
        },
        {
          title: "Taller de tejido",
          location: "Club del barrio",
          date: "Jueves 24 Oct",
          time: "16:00",
          reason: "Actividad manual y social",
          type: "Taller",
          locationImage: "/knitting-workshop.jpg",
        },
      ],
    }

    console.log("[v0] Setting fallback content:", fallbackContent)
    setContent(fallbackContent)
    localStorage.setItem("generatedContent", JSON.stringify(fallbackContent))
    calculateActivitySummary(fallbackContent)
    setIsLoading(false)
    console.log("[v0] Content generation complete")
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

  console.log("[v0] Rendering inicio page, content:", content)
  console.log("[v0] Videos count:", content?.videos?.length)
  console.log("[v0] Podcasts count:", content?.podcasts?.length)
  console.log("[v0] Events count:", content?.events?.length)

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
            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Descripción del perfil</CardTitle>
                  <div className="flex gap-2">
                    {!isEditingProfile ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReformulate}
                          disabled={isReformulating}
                          className="gap-2 bg-transparent"
                        >
                          {isReformulating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Wand2 className="h-4 w-4" />
                          )}
                          Reformular con feedback
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleStartEdit} className="gap-2 bg-transparent">
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile} className="gap-2">
                          <Save className="h-4 w-4" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditingProfile ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Nombre</p>
                      <p className="text-base">{profile?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Edad</p>
                      <p className="text-base">{profile?.age} años</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Intereses</p>
                      <p className="text-base">{profile?.interests || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Preferencias</p>
                      <p className="text-base">{profile?.preferences || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Movilidad</p>
                      <p className="text-base capitalize">{profile?.mobility}</p>
                    </div>
                    {profile?.schedule && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Horarios</p>
                        <p className="text-base">{profile.schedule}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Nombre</label>
                      <Input
                        value={editedProfile?.name || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Edad</label>
                      <Input
                        type="number"
                        value={editedProfile?.age || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Intereses</label>
                      <Textarea
                        value={editedProfile?.interests || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, interests: e.target.value })}
                        placeholder="Ej: tango, cocina, fútbol, historia..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Preferencias</label>
                      <Textarea
                        value={editedProfile?.preferences || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, preferences: e.target.value })}
                        placeholder="Ej: prefiere contenido en español, le gusta la música clásica..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Horarios</label>
                      <Textarea
                        value={editedProfile?.schedule || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile!, schedule: e.target.value })}
                        placeholder="Ej: mañanas libres, tardes ocupado..."
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

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

            <div
              key={content?.videos?.[0]?.url || "empty"}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              id="placeholder-cards"
            >
              {(() => {
                console.log("[v0] ===== PLACEHOLDER CARDS SECTION =====")
                console.log("[v0] content:", content)
                console.log("[v0] content?.videos:", content?.videos)
                console.log("[v0] content?.videos?.length:", content?.videos?.length)

                const videosToShow = content?.videos?.length ? content.videos.slice(0, 3) : [null, null, null]
                console.log("[v0] videosToShow:", videosToShow)
                console.log("[v0] videosToShow.length:", videosToShow.length)

                return videosToShow.map((video, i) => {
                  console.log(`[v0] Rendering card ${i}:`, video)
                  console.log(`[v0] Card ${i} - video exists:`, !!video)
                  console.log(`[v0] Card ${i} - video.url:`, video?.url)
                  console.log(`[v0] Card ${i} - video.thumbnail:`, video?.thumbnail)
                  console.log(`[v0] Card ${i} - video.title:`, video?.title)

                  return (
                    <Card
                      key={i}
                      className="h-[180px] bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden"
                    >
                      {video ? (
                        <>
                          {console.log(`[v0] Card ${i} - Rendering VIDEO card`)}
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div className="h-full flex flex-col">
                              <div className="flex-1 relative bg-[#F4F4F5]">
                                {console.log(
                                  `[v0] Card ${i} - About to render Image with src:`,
                                  video.thumbnail || "/placeholder.svg",
                                )}
                                <Image
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  fill
                                  className="object-cover"
                                  onLoad={() => {
                                    console.log(`[v0] Card ${i} - Image LOADED successfully:`, video.thumbnail)
                                  }}
                                  onError={(e) => {
                                    console.log(`[v0] Card ${i} - Image ERROR:`, e)
                                    const el = e.currentTarget as HTMLImageElement
                                    console.log(`[v0] Card ${i} - Current src:`, el.src)
                                    if (el.src.includes("maxresdefault")) {
                                      console.log(`[v0] Card ${i} - Trying sddefault...`)
                                      el.src = el.src.replace("maxresdefault", "sddefault")
                                    } else if (el.src.includes("sddefault")) {
                                      console.log(`[v0] Card ${i} - Trying hqdefault...`)
                                      el.src = el.src.replace("sddefault", "hqdefault")
                                    } else {
                                      console.log(`[v0] Card ${i} - Using placeholder`)
                                      el.src = "/placeholder.svg"
                                    }
                                  }}
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                              </div>
                            </div>
                          </a>
                        </>
                      ) : (
                        <>
                          {console.log(`[v0] Card ${i} - Rendering PLACEHOLDER card`)}
                          <div className="h-full flex flex-col">
                            <div className="flex-1 bg-[#F4F4F5] flex items-center justify-center border-b border-[#E4E7EC]">
                              <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-60">
                                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14" fill="none" stroke="currentColor" />
                                <path d="m3 17 5-5 4 4 3-3 6 6" fill="none" stroke="currentColor" />
                              </svg>
                            </div>
                            <div className="p-3">
                              <p className="text-sm font-medium text-foreground">Título provisional</p>
                              <p className="text-xs text-muted-foreground">Descripción breve</p>
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  )
                })
              })()}
            </div>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Youtube className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Videos de YouTube</h2>
              </div>

              {(content?.videos?.length || 0) > 3 && (
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 min-w-max md:grid md:grid-cols-2 lg:grid-cols-3 md:min-w-0">
                    {content?.videos?.slice(3).map((video, index) => (
                      <Card
                        key={index}
                        className="group relative hover:shadow-md transition-shadow overflow-hidden w-[300px] md:w-auto flex-shrink-0"
                      >
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="relative aspect-video bg-muted">
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const el = e.currentTarget as HTMLImageElement
                                if (el.src.includes("maxresdefault")) {
                                  el.src = el.src.replace("maxresdefault", "sddefault")
                                } else if (el.src.includes("sddefault")) {
                                  el.src = el.src.replace("sddefault", "hqdefault")
                                } else {
                                  el.src = "/placeholder.svg"
                                }
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                              <div className="bg-red-600 rounded-full p-3">
                                <Youtube className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-foreground line-clamp-2">{video.title}</p>
                          </div>
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Podcasts de Spotify</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content?.podcasts?.map((podcast, index) => (
                  <Card key={index} className="group relative hover:shadow-md transition-shadow overflow-hidden">
                    <button
                      onClick={() => handleRemoveContent("podcasts", index)}
                      className="absolute top-2 right-2 z-10 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      aria-label="Eliminar podcast"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={podcast.albumArt || "/placeholder.svg"}
                        alt={podcast.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                        <div className="bg-green-600 rounded-full p-3">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-2">{podcast.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate">{podcast.host}</span>
                        <Badge variant="secondary">{podcast.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{podcast.reason}</p>
                      <Button className="w-full bg-transparent" size="sm" variant="outline">
                        Escuchar en {podcast.platform}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Eventos cercanos</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content?.events?.map((event, index) => (
                  <Card key={index} className="group relative hover:shadow-md transition-shadow overflow-hidden">
                    <button
                      onClick={() => handleRemoveContent("events", index)}
                      className="absolute top-2 right-2 z-10 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      aria-label="Eliminar evento"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={event.locationImage || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        {event.type}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground truncate">{event.location}</p>
                        <p className="font-medium">
                          {event.date} • {event.time}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.reason}</p>
                      <Button className="w-full" size="sm">
                        Agendar evento
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

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
