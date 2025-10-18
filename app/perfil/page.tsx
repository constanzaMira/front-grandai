"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ElderProfile {
  name: string
  age: string
  interests: string
  mobility: string
  schedule: string
  preferences: string
  recommendations: string
  createdAt: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ElderProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ElderProfile>({
    name: "",
    age: "",
    interests: "",
    mobility: "",
    schedule: "",
    preferences: "",
    recommendations: "",
    createdAt: "",
  })

  useEffect(() => {
    const storedProfile = localStorage.getItem("elderProfile")
    if (!storedProfile) {
      router.push("/onboarding")
      return
    }

    const parsedProfile = JSON.parse(storedProfile)
    setProfile(parsedProfile)
    setFormData(parsedProfile)
  }, [router])

  const handleSave = () => {
    localStorage.setItem("elderProfile", JSON.stringify(formData))
    setProfile(formData)
    setIsEditing(false)

    // Clear cached data to regenerate with new profile
    localStorage.removeItem("weeklyPlan")
    localStorage.removeItem("discoveredContent")
    localStorage.removeItem("nearbyEvents")
  }

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que querés eliminar este perfil? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("elderProfile")
      localStorage.removeItem("weeklyPlan")
      localStorage.removeItem("discoveredContent")
      localStorage.removeItem("nearbyEvents")
      router.push("/")
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData(profile)
    }
    setIsEditing(false)
  }

  if (!profile) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName={profile.name} />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-foreground">Perfil</h1>
                <p className="text-muted-foreground">Información de {profile.name}</p>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Nombre
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-base"
                    />
                  ) : (
                    <p className="text-base text-foreground">{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base">
                    Edad
                  </Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="text-base"
                    />
                  ) : (
                    <p className="text-base text-foreground">{profile.age} años</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobility" className="text-base">
                    Movilidad
                  </Label>
                  {isEditing ? (
                    <select
                      id="mobility"
                      value={formData.mobility}
                      onChange={(e) => setFormData({ ...formData, mobility: e.target.value })}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="excelente">Excelente - Se mueve sin ayuda</option>
                      <option value="buena">Buena - Necesita ayuda ocasional</option>
                      <option value="limitada">Limitada - Usa bastón o andador</option>
                      <option value="reducida">Reducida - Usa silla de ruedas</option>
                    </select>
                  ) : (
                    <p className="text-base text-foreground capitalize">{profile.mobility}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-base">
                    Intereses y hobbies
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="interests"
                      value={formData.interests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          interests: e.target.value,
                        })
                      }
                      rows={4}
                      className="text-base resize-none"
                    />
                  ) : (
                    <p className="text-base text-foreground leading-relaxed">{profile.interests}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule" className="text-base">
                    Rutina diaria
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="schedule"
                      value={formData.schedule}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          schedule: e.target.value,
                        })
                      }
                      rows={3}
                      className="text-base resize-none"
                    />
                  ) : (
                    <p className="text-base text-foreground leading-relaxed">{profile.schedule || "No especificada"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-base">
                    Otras preferencias
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="preferences"
                      value={formData.preferences}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: e.target.value,
                        })
                      }
                      rows={3}
                      className="text-base resize-none"
                    />
                  ) : (
                    <p className="text-base text-foreground leading-relaxed">
                      {profile.preferences || "No especificadas"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Zona de Peligro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Eliminar este perfil borrará toda la información y el contenido generado. Esta acción no se puede
                  deshacer.
                </p>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
