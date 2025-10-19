"use client"

import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube"

export default function OnboardingPage() {
  const { isLoading: authLoading } = useAuth({ requireAuth: true })
  const { toast } = useToast()

  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    interests: "",
    mobility: "buena",
    schedule: "",
    preferences: "",
    updateFrequency: "weekly",
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleRegister = async () => {
    setIsSubmitting(true)

    try {
      const payload = {
        nombre: formData.name,
        edad: Number.parseInt(formData.age),
        descripcion: formData.interests,
        movilidad: formData.mobility,
        frecuencia_update: formData.updateFrequency,
        credencial_id: 1,
      }
      console.log("[v0] Sending request to API proxy:", payload)

      const response = await fetch("/api/proxy/register-elder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("[v0] Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || "Error al crear el perfil")
      }

      const data = await response.json()
      console.log("[v0] Backend response:", data)

      if (!data.credencial_id) {
        console.warn("[v0] Warning: No credencial_id in response")
      }

      localStorage.setItem(
        "elderProfile",
        JSON.stringify({
          ...formData,
          credencial_id: data.credencial_id,
          createdAt: new Date().toISOString(),
        }),
      )

      toast({
        title: "Perfil registrado exitosamente",
        description: `El perfil de ${formData.name} ha sido registrado en el backend.`,
      })

      setIsRegistered(true)
      setStep(4)
    } catch (error) {
      console.error("[v0] Error creating profile:", error)

      console.log("[v0] Using local storage fallback")

      localStorage.setItem(
        "elderProfile",
        JSON.stringify({
          ...formData,
          credencial_id: 1,
          createdAt: new Date().toISOString(),
        }),
      )

      toast({
        title: "Perfil guardado localmente",
        description: "No se pudo conectar con el backend, pero el perfil se guardó localmente.",
        variant: "default",
      })

      setIsRegistered(true)
      setStep(4)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerate = async () => {
    setIsSubmitting(true)

    try {
      const storedProfile = localStorage.getItem("elderProfile")
      if (!storedProfile) {
        throw new Error("No se encontró el perfil")
      }

      const profile = JSON.parse(storedProfile)
      const credencialId = profile.credencial_id || 1

      console.log("[v0] Generating content for credencial_id:", credencialId)

      const response = await fetch(`/api/proxy/generate-content/${credencialId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // empty body
      })

      console.log("[v0] Generate content response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Generated content data:", data)

      const videos = (data.resultados || []).map((item: any) => {
        const id = extractYouTubeId(item.url)
        const thumb = id ? getYouTubeThumbnail(id, "maxresdefault") : "/placeholder.svg"
        return {
          title: item.titulo,
          url: item.url,
          channel: "", // optional for now
          duration: "", // optional for now
          reason: "Generado por IA",
          thumbnail: thumb,
        }
      })

      const generated = { videos, podcasts: [], events: [] }
      localStorage.setItem("generatedContent", JSON.stringify(generated))

      toast({
        title: "Contenido generado exitosamente",
        description: "Se ha creado contenido personalizado basado en los intereses",
      })

      router.push("/inicio")
    } catch (error) {
      console.error("[v0] Error generating content:", error)

      console.log("[v0] Using mock data as fallback")

      const mockData = {
        videos: [
          {
            url: "https://www.youtube.com/watch?v=oaFveLEFioo",
            title: "Historias del 900 – Episodio 1",
            channel: "Radio Nacional",
            duration: "18:00",
            reason: "Basado en intereses ingresados",
            thumbnail: "https://img.youtube.com/vi/oaFveLEFioo/maxresdefault.jpg",
          },
        ],
        podcasts: [],
        events: [],
      }

      localStorage.setItem("generatedContent", JSON.stringify(mockData))

      toast({
        title: "Usando contenido de ejemplo",
        description: "No se pudo conectar con el backend. Se cargó contenido de ejemplo.",
        variant: "default",
      })

      router.push("/inicio")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return formData.name && formData.age
    if (step === 2) return formData.interests
    return true
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 animate-pulse text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Grand AI</h1>
          <p className="ml-4 text-sm text-muted-foreground">Plan de {formData.name || "Configuración"}</p>
        </div>
      </header>

      <main className="p-4 pb-20 md:pb-8">
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-20 rounded-full ${s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">
              {step === 1 && "Información básica"}
              {step === 2 && "Intereses y gustos"}
              {step === 3 && "Preferencias y horarios"}
              {step === 4 && "Generar contenido"}
            </h2>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="name" className="mb-2 block text-base font-medium">
                    ¿Cómo se llama?
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Ej: Nélida"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="age" className="mb-2 block text-base font-medium">
                    ¿Qué edad tiene?
                  </label>
                  <input
                    id="age"
                    type="number"
                    placeholder="Ej: 75"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="mobility" className="mb-2 block text-base font-medium">
                    Movilidad
                  </label>
                  <select
                    id="mobility"
                    value={formData.mobility}
                    onChange={(e) => setFormData({ ...formData, mobility: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
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
              <div>
                <label htmlFor="interests" className="mb-2 block text-base font-medium">
                  ¿Qué le gusta hacer? ¿Cuáles son sus hobbies?
                </label>
                <textarea
                  id="interests"
                  placeholder="Ej: Le encanta tejer, escuchar tango, ver películas clásicas, cocinar recetas tradicionales..."
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  rows={6}
                  className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Contanos todo lo que le gusta. Esto ayuda a la IA a personalizar el contenido.
                </p>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <label className="mb-2 block text-base font-semibold">
                    ¿Cada cuánto querés actualizar el contenido?
                  </label>
                  <p className="mb-4 text-sm text-muted-foreground">
                    La app generará nuevo contenido personalizado según esta frecuencia, basándose en lo que
                    {formData.name ? ` ${formData.name}` : " la persona"} vio y le gustó.
                  </p>

                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-input bg-background p-3 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="updateFrequency"
                        value="weekly"
                        checked={formData.updateFrequency === "weekly"}
                        onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium">Cada semana</div>
                        <div className="text-sm text-muted-foreground">Contenido fresco semanalmente</div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-input bg-background p-3 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="updateFrequency"
                        value="biweekly"
                        checked={formData.updateFrequency === "biweekly"}
                        onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium">Cada 2 semanas</div>
                        <div className="text-sm text-muted-foreground">Actualización quincenal</div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-input bg-background p-3 transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="updateFrequency"
                        value="monthly"
                        checked={formData.updateFrequency === "monthly"}
                        onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className="font-medium">Cada mes</div>
                        <div className="text-sm text-muted-foreground">Contenido nuevo mensualmente</div>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
                  <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">¡Perfil registrado exitosamente!</h3>
                  <p className="text-muted-foreground mb-4">
                    El perfil de {formData.name} ha sido creado. Ahora podés generar contenido personalizado basado en
                    sus intereses y preferencias.
                  </p>
                  <div className="bg-background rounded-md p-4 text-left space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Nombre:</span> {formData.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Edad:</span> {formData.age} años
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Movilidad:</span> {formData.mobility}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Frecuencia de actualización:</span>{" "}
                      {formData.updateFrequency === "weekly"
                        ? "Semanal"
                        : formData.updateFrequency === "biweekly"
                          ? "Quincenal"
                          : "Mensual"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && step < 4 && (
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 font-medium transition-colors hover:bg-accent disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
              )}

              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={handleRegister}
                  disabled={!canProceed() || isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </button>
              )}

              {step === 4 && (
                <button
                  onClick={handleGenerate}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
