"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    interests: "",
    mobility: "buena",
    schedule: "",
    preferences: "",
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      // Guardar el perfil en localStorage
      localStorage.setItem(
        "elderProfile",
        JSON.stringify({
          ...formData,
          recommendations: data.recommendations,
          createdAt: new Date().toISOString(),
        }),
      )

      router.push("/inicio")
    } catch (error) {
      console.error("Error generating profile:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.name && formData.age
    if (step === 2) return formData.interests
    if (step === 3) return true
    return false
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader elderName={formData.name || "Configuración"} />

      <main className="flex-1 pb-8">
        <div className="container max-w-2xl px-4 py-8">
          {/* Progress indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                {step === 1 && "Información básica"}
                {step === 2 && "Intereses y gustos"}
                {step === 3 && "Preferencias y horarios"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      ¿Cómo se llama?
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ej: Nélida"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base">
                      ¿Qué edad tiene?
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Ej: 75"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobility" className="text-base">
                      Movilidad
                    </Label>
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
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-base">
                      ¿Qué le gusta hacer? ¿Cuáles son sus hobbies?
                    </Label>
                    <Textarea
                      id="interests"
                      placeholder="Ej: Le encanta tejer, escuchar tango, ver películas clásicas, cocinar recetas tradicionales..."
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      rows={5}
                      className="text-base resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      Contanos todo lo que le gusta. Esto ayuda a la IA a personalizar el contenido.
                    </p>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schedule" className="text-base">
                      ¿Cuál es su rutina diaria? (Opcional)
                    </Label>
                    <Textarea
                      id="schedule"
                      placeholder="Ej: Se levanta a las 8, desayuna a las 9, le gusta hacer actividades por la mañana, duerme siesta de 14 a 16..."
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences" className="text-base">
                      Otras preferencias o información importante (Opcional)
                    </Label>
                    <Textarea
                      id="preferences"
                      placeholder="Ej: No le gusta la tecnología complicada, prefiere actividades tranquilas, le gusta estar con gente..."
                      value={formData.preferences}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferences: e.target.value,
                        })
                      }
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isGenerating}
                    className="flex-1 bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                )}

                <Button onClick={handleNext} disabled={!canProceed() || isGenerating} className="flex-1">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando perfil...
                    </>
                  ) : step === 3 ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar plan con IA
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
