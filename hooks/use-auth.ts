"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth, type AuthState } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function useAuth(options?: { requireAuth?: boolean }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    profileId: null,
    rememberOnThisDevice: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const state = auth.getState()
    setAuthState(state)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading || !options?.requireAuth) return

    const redirectTo = auth.shouldRedirect(pathname)

    if (redirectTo) {
      const state = auth.getState()

      // Show appropriate toast message
      if (!state.isLoggedIn) {
        toast({
          title: "Necesitás iniciar sesión",
          description: "Por favor, ingresá para continuar.",
        })
      } else if (!state.role) {
        toast({
          title: "Elegí un rol para continuar",
          description: "Seleccioná cómo vas a usar Grand AI.",
        })
      } else if (state.role === "familiar" && !state.profileId) {
        toast({
          title: "Seleccioná un perfil para continuar",
          description: "Elegí el perfil del adulto mayor.",
        })
      }

      router.push(redirectTo)
    }
  }, [pathname, router, toast, isLoading, options?.requireAuth])

  // Refresh auth state
  const refreshAuth = () => {
    setAuthState(auth.getState())
  }

  // Login
  const login = () => {
    auth.setLoggedIn(true)
    refreshAuth()
  }

  // Logout
  const logout = () => {
    auth.clear()
    refreshAuth()
    router.push("/login")
  }

  // Set role
  const setRole = (role: "familiar" | "hogar", rememberDevice = false) => {
    auth.setRole(role)
    if (rememberDevice) {
      auth.setRememberDevice(true)
    }
    refreshAuth()
  }

  // Set profile
  const setProfile = (profileId: string) => {
    auth.setProfileId(profileId)
    refreshAuth()
  }

  return {
    ...authState,
    login,
    logout,
    setRole,
    setProfile,
    refreshAuth,
    isLoading,
  }
}
