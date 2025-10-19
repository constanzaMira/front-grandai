// Auth utility for managing authentication state in localStorage

export type AuthRole = "familiar" | "hogar" | null

export interface AuthState {
  isLoggedIn: boolean
  role: AuthRole
  profileId: string | null
  rememberOnThisDevice: boolean
}

const AUTH_KEYS = {
  IS_LOGGED_IN: "auth.isLoggedIn",
  ROLE: "auth.role",
  PROFILE_ID: "auth.profileId",
  REMEMBER_DEVICE: "auth.rememberOnThisDevice",
}

export const auth = {
  // Get current auth state
  getState(): AuthState {
    if (typeof window === "undefined") {
      return {
        isLoggedIn: false,
        role: null,
        profileId: null,
        rememberOnThisDevice: false,
      }
    }

    return {
      isLoggedIn: localStorage.getItem(AUTH_KEYS.IS_LOGGED_IN) === "true",
      role: (localStorage.getItem(AUTH_KEYS.ROLE) as AuthRole) || null,
      profileId: localStorage.getItem(AUTH_KEYS.PROFILE_ID),
      rememberOnThisDevice: localStorage.getItem(AUTH_KEYS.REMEMBER_DEVICE) === "true",
    }
  },

  // Set logged in state
  setLoggedIn(value: boolean) {
    if (typeof window === "undefined") return
    localStorage.setItem(AUTH_KEYS.IS_LOGGED_IN, String(value))
  },

  // Set role
  setRole(role: AuthRole) {
    if (typeof window === "undefined") return
    if (role) {
      localStorage.setItem(AUTH_KEYS.ROLE, role)
    } else {
      localStorage.removeItem(AUTH_KEYS.ROLE)
    }
  },

  // Set profile ID
  setProfileId(profileId: string | null) {
    if (typeof window === "undefined") return
    if (profileId) {
      localStorage.setItem(AUTH_KEYS.PROFILE_ID, profileId)
    } else {
      localStorage.removeItem(AUTH_KEYS.PROFILE_ID)
    }
  },

  // Set remember device
  setRememberDevice(value: boolean) {
    if (typeof window === "undefined") return
    localStorage.setItem(AUTH_KEYS.REMEMBER_DEVICE, String(value))
  },

  // Clear all auth data (logout)
  clear() {
    if (typeof window === "undefined") return
    Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key))
  },

  // Check if user should be redirected based on current state
  shouldRedirect(pathname: string): string | null {
    const state = this.getState()

    const publicRoutes = ["/login", "/role", "/hogar"]

    const protectedRoutes = ["/inicio", "/descubrir", "/eventos", "/actividad"]

    // Never redirect if we're on a public route
    if (publicRoutes.includes(pathname)) {
      return null
    }

    // Only apply auth checks if we're on a protected route
    if (protectedRoutes.includes(pathname)) {
      // Not logged in or no role - redirect to login
      if (!state.role) {
        return "/login"
      }

      // Hogar role trying to access family pages
      if (state.role === "hogar") {
        return "/hogar"
      }
    }

    return null
  },
}
