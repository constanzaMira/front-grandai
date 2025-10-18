"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Search, Music, Video, Headphones, BookOpen, Loader2, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContentItem {
  id: string
  title: string
  description: string
  type: "podcast" | "video" | "music" | "audiobook"
  duration: string
  relevance: string
}

interface ElderProfile {
  name: string
  interests: string
}

export default function DescubrirPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("todos")

  useEffect(() => {
    const storedProfile = localStorage.getItem("elderProfile")
    if (!storedProfile) {
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    setProfile(parsedProfile)

    const storedContent = localStorage.getItem("discoveredContent")
    if (storedContent) {
      setContent(JSON.parse(storedContent))
    } else {
      generateContent(parsedProfile)
    }
  }, [router])

  const generateContent = async (profileData: ElderProfile) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: profileData.interests,
          name: profileData.name,
        }),
      })

      const data = await response.json()
      setContent(data.content)
      localStorage.setItem("discoveredContent", JSON.stringify(data.content))
    } catch (error) {
      console.error("[v0] Error generating content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim() || !profile) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: profile.interests,
          name: profile.name,
          searchQuery: searchQuery,
        }),
      })

      const data = await response.json()
      setContent(data.content)
    } catch (error) {
      console.error("[v0] Error searching content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "podcast":
        return <Headphones className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "music":
        return <Music className="h-5 w-5" />
      case "audiobook":
        return <BookOpen className="h-5 w-5" />
      default:
        return <Play className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "podcast":
        return "Podcast"
      case "video":
        return "Video"
      case "music":
        return "Música"
      case "audiobook":
        return "Audiolibro"
      default:
        return type
    }
  }

  const filteredContent = selectedType === "todos" ? content : content.filter((item) => item.type === selectedType)

  if (!profile) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName={profile.name} />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-6xl px-4 py-8">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-foreground">Descubrir Contenido</h1>
              <p className="text-muted-foreground">Contenido personalizado para {profile.name}</p>
            </div>

            {/* Search bar */}
            <div className="mb-6 flex gap-2">
              <Input
                placeholder="Buscar contenido específico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Type filters */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedType === "todos" ? "default" : "outline"}
                onClick={() => setSelectedType("todos")}
                className="shrink-0"
              >
                Todos
              </Button>
              <Button
                variant={selectedType === "podcast" ? "default" : "outline"}
                onClick={() => setSelectedType("podcast")}
                className="shrink-0"
              >
                <Headphones className="mr-2 h-4 w-4" />
                Podcasts
              </Button>
              <Button
                variant={selectedType === "video" ? "default" : "outline"}
                onClick={() => setSelectedType("video")}
                className="shrink-0"
              >
                <Video className="mr-2 h-4 w-4" />
                Videos
              </Button>
              <Button
                variant={selectedType === "music" ? "default" : "outline"}
                onClick={() => setSelectedType("music")}
                className="shrink-0"
              >
                <Music className="mr-2 h-4 w-4" />
                Música
              </Button>
              <Button
                variant={selectedType === "audiobook" ? "default" : "outline"}
                onClick={() => setSelectedType("audiobook")}
                className="shrink-0"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Audiolibros
              </Button>
            </div>

            {/* Content grid */}
            {isLoading && content.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Sparkles className="mb-4 h-12 w-12 animate-pulse text-primary" />
                  <p className="text-lg font-medium">Generando recomendaciones personalizadas...</p>
                  <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2 text-primary">
                        {getTypeIcon(item.type)}
                        <span className="text-sm font-medium">{getTypeLabel(item.type)}</span>
                      </div>
                      <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duración:</span>
                          <span className="font-medium">{item.duration}</span>
                        </div>
                        <div className="rounded-md bg-primary/10 p-2">
                          <p className="text-xs text-primary">
                            <span className="font-semibold">Por qué es relevante:</span> {item.relevance}
                          </p>
                        </div>
                        <Button className="w-full bg-transparent" variant="outline">
                          <Play className="mr-2 h-4 w-4" />
                          Agregar al plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredContent.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No se encontró contenido para este filtro</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
