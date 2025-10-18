"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Youtube, Music, Calendar, Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

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
    channel: string
    duration: string
    reason: string
    url: string
  }>
  podcasts: Array<{
    title: string
    host: string
    duration: string
    reason: string
    platform: string
  }>
  events: Array<{
    title: string
    location: string
    date: string
    time: string
    reason: string
    type: string
  }>
}

export default function InicioPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    const storedProfile = localStorage.getItem("elderProfile")
    if (!storedProfile) {
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    setProfile(parsedProfile)

    // Check if content already exists
    const storedContent = localStorage.getItem("generatedContent")
    if (storedContent) {
      setContent(JSON.parse(storedContent))
      setIsLoading(false)
    } else {
      generateContent(parsedProfile)
    }
  }, [router])

  const generateContent = async (profileData: ElderProfile) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-initial-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()
      setContent(data.content)
      localStorage.setItem("generatedContent", JSON.stringify(data.content))
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!profile) return
    setIsRegenerating(true)
    await generateContent(profile)
    setIsRegenerating(false)
  }

  if (isLoading) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName={profile?.name || "Inicio"} />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-6xl px-4 py-6">
            {/* Header with regenerate button */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Contenido personalizado</h1>
                <p className="text-muted-foreground">Generado con IA para {profile?.name}</p>
              </div>
              <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating}>
                {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            {/* Videos Section */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Youtube className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Videos de YouTube</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content?.videos.map((video, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-2">{video.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{video.channel}</span>
                        <Badge variant="secondary">{video.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.reason}</p>
                      <Button className="w-full" size="sm" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          Ver video
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Podcasts Section */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Podcasts de Spotify</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content?.podcasts.map((podcast, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base line-clamp-2">{podcast.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{podcast.host}</span>
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

            {/* Events Section */}
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Eventos cercanos</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content?.events.map((event, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2">{event.title}</CardTitle>
                        <Badge variant="outline" className="shrink-0">
                          {event.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{event.location}</p>
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

            {/* CTA to discover more */}
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
