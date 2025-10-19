"use client"

import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react"

export default function OnboardingPage() {
  const { isLoading: authLoading } = useAuth({ requireAuth: true })

  const router = useRouter()
  const [step, setStep] = useState(1)

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

  const handleFinish = () => {
    // Save profile to localStorage
    localStorage.setItem(
      "elderProfile",
      JSON.stringify({
        ...formData,
        createdAt: new Date().toISOString(),
      }),
    )

    // Redirect to home page
    router.push("/inicio")
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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Grand AI</h1>
          <p className="ml-4 text-sm text-muted-foreground">Plan de {formData.name || "Configuración"}</p>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 pb-20 md:pb-8">
        {/* Progress bars */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-20 rounded-full ${s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"}`}
            />
          ))}
        </div>

        {/* Form card */}
        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
          {/* Card header */}
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">
              {step === 1 && "Información básica"}
              {step === 2 && "Intereses y gustos"}
              {step === 3 && "Preferencias y horarios"}
            </h2>
          </div>

          {/* Form content */}
          <div className="space-y-6">
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div>
                  
                  
                </div>

                <div>
                  
                  
                </div>

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

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 font-medium transition-colors hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {step === 3 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Comenzar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
