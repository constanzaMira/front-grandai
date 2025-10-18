"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Youtube, Music, Calendar, CheckCircle2, Circle, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContentItem {
  type: "video" | "podcast" | "event"
  title: string
  status: "reproducido" | "no-iniciado"
  lastPlayed?: string
}

type FilterType = "todos" | "videos" | "podcasts" | "eventos"
type WeekRange = "esta-semana" | "semana-anterior"

export default function ActividadPage() {
  const router = useRouter()
  const [weekRange, setWeekRange] = useState<WeekRange>("esta-semana")
  const [filterType, setFilterType] = useState<FilterType>("todos")
  const [contentItems, setContentItems] = useState<ContentItem[]>([])

  // KPI values
  const [kpis, setKpis] = useState({
    programados: 0,
    reproducidos: 0,
    noIniciados: 0,
    tasaReproduccion: 0,
  })

  useEffect(() => {
    const storedContent = localStorage.getItem("generatedContent")
    if (storedContent) {
      const content = JSON.parse(storedContent)
      const items: ContentItem[] = []

      // Add videos
      content.videos?.forEach((video: any) => {
        items.push({
          type: "video",
          title: video.title,
          status: Math.random() > 0.5 ? "reproducido" : "no-iniciado",
          lastPlayed: Math.random() > 0.5 ? "Hace 2 días" : undefined,
        })
      })

      // Add podcasts
      content.podcasts?.forEach((podcast: any) => {
        items.push({
          type: "podcast",
          title: podcast.title,
          status: Math.random() > 0.5 ? "reproducido" : "no-iniciado",
          lastPlayed: Math.random() > 0.5 ? "Hace 1 día" : undefined,
        })
      })

      // Add events
      content.events?.forEach((event: any) => {
        items.push({
          type: "event",
          title: event.title,
          status: Math.random() > 0.5 ? "reproducido" : "no-iniciado",
          lastPlayed: Math.random() > 0.5 ? "Hace 3 días" : undefined,
        })
      })

      setContentItems(items)

      // Calculate KPIs
      const programados = items.length
      const reproducidos = items.filter((item) => item.status === "reproducido").length
      const noIniciados = items.filter((item) => item.status === "no-iniciado").length
      const tasaReproduccion = programados > 0 ? Math.round((reproducidos / programados) * 100) : 0

      setKpis({ programados, reproducidos, noIniciados, tasaReproduccion })
    }
  }, [])

  // Get week range text
  const getWeekRangeText = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    }

    return `${formatDate(monday)} al ${formatDate(sunday)}`
  }

  // Filter content based on selected filter
  const filteredContent = contentItems.filter((item) => {
    if (filterType === "todos") return true
    if (filterType === "videos") return item.type === "video"
    if (filterType === "podcasts") return item.type === "podcast"
    if (filterType === "eventos") return item.type === "event"
    return true
  })

  // Sort: "no-iniciado" first, then "reproducido"
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (a.status === "no-iniciado" && b.status === "reproducido") return -1
    if (a.status === "reproducido" && b.status === "no-iniciado") return 1
    return 0
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="h-5 w-5 text-red-600" />
      case "podcast":
        return <Music className="h-5 w-5 text-green-600" />
      case "event":
        return <Calendar className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const isEmpty = contentItems.length === 0
  const noneReproduced = contentItems.length > 0 && kpis.reproducidos === 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader elderName="Actividad" />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-5xl px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">Resumen de actividad</h1>
              <p className="text-sm text-muted-foreground">Semana del {getWeekRangeText()}</p>
            </div>

            <div className="mb-6 space-y-4">
              {/* Segmented control for week range */}
              <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                <button
                  onClick={() => setWeekRange("esta-semana")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    weekRange === "esta-semana"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Esta semana
                </button>
                <button
                  onClick={() => setWeekRange("semana-anterior")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    weekRange === "semana-anterior"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Semana anterior
                </button>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterType === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("todos")}
                  className="rounded-full"
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "videos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("videos")}
                  className="rounded-full"
                >
                  Videos
                </Button>
                <Button
                  variant={filterType === "podcasts" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("podcasts")}
                  className="rounded-full"
                >
                  Podcasts
                </Button>
                <Button
                  variant={filterType === "eventos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("eventos")}
                  className="rounded-full"
                >
                  Eventos
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />
            </div>

            {isEmpty ? (
              <Card className="border-border">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Todavía no hay contenidos programados para esta semana.
                  </h3>
                  <Button variant="outline" onClick={() => router.push("/descubrir")} className="mt-4">
                    Ir a Descubrir contenido
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Programados */}
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <div className="text-3xl font-bold text-foreground mb-1">{kpis.programados}</div>
                          <div className="text-xs text-muted-foreground">cont.</div>
                          <div className="text-sm font-medium text-foreground mt-1">Programados</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reproducidos */}
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <div className="text-3xl font-bold text-foreground mb-1">{kpis.reproducidos}</div>
                          <div className="text-xs text-muted-foreground">cont.</div>
                          <div className="text-sm font-medium text-foreground mt-1">Reproducidos</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* No iniciados */}
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Circle className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <div className="text-3xl font-bold text-foreground mb-1">{kpis.noIniciados}</div>
                          <div className="text-xs text-muted-foreground">cont.</div>
                          <div className="text-sm font-medium text-foreground mt-1">No iniciados</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasa de reproducción */}
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <div className="text-3xl font-bold text-foreground mb-1">{kpis.tasaReproduccion}%</div>
                          <div className="text-xs text-muted-foreground">de programados</div>
                          <div className="text-sm font-medium text-foreground mt-1">Tasa de reproducción</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mb-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Checklist de reproducción</h2>
                    <p className="text-sm text-muted-foreground">Qué se reprodujo y qué no</p>
                  </div>

                  {noneReproduced && (
                    <p className="text-sm text-muted-foreground mb-4 italic">Aún no se reprodujo nada esta semana.</p>
                  )}

                  {/* Desktop: Table headers */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border mb-2">
                    <div className="col-span-1">Tipo</div>
                    <div className="col-span-5">Título</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2">Última vez</div>
                    <div className="col-span-2"></div>
                  </div>

                  {/* Content list */}
                  <div className="space-y-2">
                    {sortedContent.map((item, index) => (
                      <Card key={index} className="border-border shadow-sm">
                        <CardContent className="p-4">
                          <div className="grid md:grid-cols-12 gap-4 items-center">
                            {/* Type icon */}
                            <div className="col-span-1 flex items-center">{getTypeIcon(item.type)}</div>

                            {/* Title */}
                            <div className="col-span-12 md:col-span-5">
                              <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                            </div>

                            {/* Status */}
                            <div className="col-span-12 md:col-span-2">
                              <Badge
                                variant={item.status === "reproducido" ? "default" : "secondary"}
                                className={
                                  item.status === "reproducido"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                }
                              >
                                {item.status === "reproducido" ? "Reproducido" : "No iniciado"}
                              </Badge>
                            </div>

                            {/* Last played */}
                            <div className="col-span-12 md:col-span-2">
                              <p className="text-xs text-muted-foreground">{item.lastPlayed || "—"}</p>
                            </div>

                            {/* Action button */}
                            <div className="col-span-12 md:col-span-2 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-xs">
                                Cambiar por otro
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
