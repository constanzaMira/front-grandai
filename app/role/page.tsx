"use client"

import { useRouter } from "next/navigation"
import { Users, Home } from "lucide-react"
import { auth } from "@/lib/auth"

export default function RolePage() {
  const router = useRouter()

  const handleRoleSelect = async (role: "familiar" | "hogar") => {
    auth.setRole(role)

    if (role === "familiar") {
      localStorage.removeItem("elderProfile")
      localStorage.removeItem("generatedContent")
      localStorage.removeItem("contentFeedback")
      auth.setProfileId(null)
      router.push("/onboarding")
    } else {
      auth.setProfileId(null)
      router.push("/hogar")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">¿Cómo vas a usar Grand AI?</h1>
          <p className="text-gray-600 text-lg">Elegí el perfil que se adapte</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Familiar Card */}
          <button
            onClick={() => handleRoleSelect("familiar")}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 text-center transition-all hover:border-primary hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Familiar</h2>
            <p className="text-gray-600 text-base leading-relaxed">Configurar gustos, plan y eventos</p>
          </button>

          {/* Usuario Card */}
          <button
            onClick={() => handleRoleSelect("hogar")}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 text-center transition-all hover:border-primary hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
              <Home className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Usuario</h2>
            <p className="text-gray-600 text-base leading-relaxed">Interfaz simple del hogar</p>
          </button>
        </div>
      </div>
    </div>
  )
}
