"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, MapPin, Calendar, Clock, Users, Loader2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  type: "bingo" | "taller" | "misa" | "social" | "ejercicio"
  date: string
  time: string
  location: string
  distance: string
}

interface ElderProfile {
  name: string
  interests: string
  mobility: string
}

export default function EventosPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("todos")
  const [locationQuery, setLocationQuery] = useState("")

  useEffect(() => {
    const storedProfile = localStorage.getItem("elderProfile")
    if (!storedProfile) {
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    setProfile(parsedProfile)

    const storedEvents = localStorage.getItem("nearbyEvents")
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    } else {
      generateEvents(parsedProfile)
    }
  }, [router])

  const generateEvents = async (profileData: ElderProfile, location?: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: profileData.interests,
          mobility: profileData.mobility,
          name: profileData.name,
          location: location || "Buenos Aires",
        }),
      })

      const data = await response.json()
      setEvents(data.events)
      localStorage.setItem("nearbyEvents", JSON.stringify(data.events))
    } catch (error) {
      console.error("[v0] Error generating events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSearch = () => {
    if (profile && locationQuery.trim()) {
      generateEvents(profile, locationQuery)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bingo":
        return "Bingo"
      case "taller":
        return "Taller"
      case "misa":
        return "Misa"
      case "social":
        return "Social"
      case "ejercicio":
        return "Ejercicio"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bingo":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300"
      case "taller":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300"
      case "misa":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "social":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "ejercicio":
        return "bg-red-500/10 text-red-700 dark:text-red-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredEvents = selectedType === "todos" ? events : events.filter((event) => event.type === selectedType)

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
              <h1 className="mb-2 text-3xl font-bold text-foreground">Eventos Cercanos</h1>
              <p className="text-muted-foreground">Actividades y eventos en tu zona</p>
            </div>

            {/* Location search */}
            <div className="mb-6 flex gap-2">
              <Input
                placeholder="Buscar por ubicación..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                className="flex-1"
              />
              <Button onClick={handleLocationSearch} disabled={isLoading || !locationQuery.trim()}>
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
                variant={selectedType === "bingo" ? "default" : "outline"}
                onClick={() => setSelectedType("bingo")}
                className="shrink-0"
              >
                Bingo
              </Button>
              <Button
                variant={selectedType === "taller" ? "default" : "outline"}
                onClick={() => setSelectedType("taller")}
                className="shrink-0"
              >
                Talleres
              </Button>
              <Button
                variant={selectedType === "misa" ? "default" : "outline"}
                onClick={() => setSelectedType("misa")}
                className="shrink-0"
              >
                Misa
              </Button>
              <Button
                variant={selectedType === "social" ? "default" : "outline"}
                onClick={() => setSelectedType("social")}
                className="shrink-0"
              >
                Social
              </Button>
              <Button
                variant={selectedType === "ejercicio" ? "default" : "outline"}
                onClick={() => setSelectedType("ejercicio")}
                className="shrink-0"
              >
                Ejercicio
              </Button>
            </div>

            {/* Events grid */}
            {isLoading && events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Sparkles className="mb-4 h-12 w-12 animate-pulse text-primary" />
                  <p className="text-lg font-medium">Buscando eventos cercanos...</p>
                  <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(event.type)}`}>
                          {getTypeLabel(event.type)}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col">
                      <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{event.distance}</span>
                        </div>
                        <Button className="mt-2 w-full bg-transparent" variant="outline">
                          Agregar al calendario
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredEvents.length === 0 && (
              <Card>
                <CardContent className="py-16 text-center">
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No se encontraron eventos para este filtro</p>
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
