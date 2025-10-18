"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, ArrowLeft, Plus, X, Tag } from "lucide-react"
import { useRouter } from "next/navigation"

interface ElderProfile {
  name: string
  interests: string
  [key: string]: any
}

export default function PersonalizarPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [newInterest, setNewInterest] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    const storedProfile = localStorage.getItem("elderProfile")
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      setProfile(parsedProfile)

      // Parse existing interests into array
      const interestsList = parsedProfile.interests
        .split(",")
        .map((i: string) => i.trim())
        .filter((i: string) => i.length > 0)
      setInterests(interestsList)
    }
  }, [])

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()]
      setInterests(updatedInterests)
      setNewInterest("")

      // Update profile in localStorage
      if (profile) {
        const updatedProfile = {
          ...profile,
          interests: updatedInterests.join(", "),
        }
        setProfile(updatedProfile)
        localStorage.setItem("elderProfile", JSON.stringify(updatedProfile))
      }
    }
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter((i) => i !== interestToRemove)
    setInterests(updatedInterests)

    // Update profile in localStorage
    if (profile) {
      const updatedProfile = {
        ...profile,
        interests: updatedInterests.join(", "),
      }
      setProfile(updatedProfile)
      localStorage.setItem("elderProfile", JSON.stringify(updatedProfile))
    }
  }

  const handleRegenerateContent = async () => {
    if (!profile) return

    setIsRegenerating(true)
    try {
      const response = await fetch("/api/generate-initial-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      const data = await response.json()
      localStorage.setItem("generatedContent", JSON.stringify(data.content))

      // Clear old feedback since we have new content
      localStorage.removeItem("contentFeedback")

      router.push("/inicio")
    } catch (error) {
      console.error("Error regenerating content:", error)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName={profile?.name || "Personalizar"} />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-3xl px-4 py-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Agregar intereses</h1>
              <p className="text-muted-foreground">
                Agregá nuevos temas o artistas que le gusten a {profile?.name} para personalizar el contenido
              </p>
            </div>

            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Agregar nuevo interés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-interest">Tema, artista, actividad o cualquier cosa que le interese</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-interest"
                      placeholder="Ej: Elton John, tejido, historia uruguaya..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddInterest()
                        }
                      }}
                      className="flex-1 h-12 text-base"
                    />
                    <Button onClick={handleAddInterest} size="lg" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>

                
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Intereses actuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-2 px-3 gap-2">
                        {interest}
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-destructive transition-colors"
                          aria-label={`Eliminar ${interest}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay intereses agregados todavía. Agregá el primero arriba.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent/30 mb-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">¿Cómo funciona?</p>
                    <p className="text-sm text-muted-foreground">
                      Después de agregar o quitar intereses, hacé clic en "Regenerar contenido" para que la IA busque
                      nuevos videos, podcasts y eventos basados en las preferencias actualizadas de {profile?.name}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleRegenerateContent}
              disabled={isRegenerating || interests.length === 0}
              className="w-full h-12 text-base gap-2"
              size="lg"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Regenerando contenido...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Regenerar contenido con nuevos intereses
                </>
              )}
            </Button>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
