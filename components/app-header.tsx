"use client"

import { Menu, User, LogOut, Users, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { useEffect, useState } from "react"

interface AppHeaderProps {
  elderName?: string
  onMenuClick?: () => void
}

export function AppHeader({ elderName = "Nélida", onMenuClick }: AppHeaderProps) {
  const router = useRouter()
  const [authState, setAuthState] = useState(auth.getState())

  useEffect(() => {
    // Update auth state when component mounts
    setAuthState(auth.getState())
  }, [])

  const handleLogout = () => {
    auth.clear()
    router.push("/login")
  }

  const handleChangeProfile = () => {
    auth.setProfileId(null)
    router.push("/profiles")
  }

  const handleChangeRole = () => {
    auth.setRole(null)
    auth.setProfileId(null)
    router.push("/role")
  }

  // Get initials from elder name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-foreground">Grand AI</h1>
              <p className="text-sm text-muted-foreground">Plan de {elderName}</p>
            </div>
            {authState.isLoggedIn && authState.role && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {authState.role === "familiar" ? "Familiar" : "Hogar"}
              </Badge>
            )}
          </div>
        </div>

        {authState.isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-full">
                <Avatar className="h-11 w-11">
                  <AvatarImage src="/placeholder.svg?height=44&width=44" alt="Usuario" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {authState.role === "familiar" && elderName ? getInitials(elderName) : <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    {authState.role === "familiar" ? "Familiar cuidador" : "Modo hogar"}
                  </p>
                  {authState.role === "familiar" && elderName && (
                    <p className="text-sm leading-none text-muted-foreground">Perfil: {elderName}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {authState.role === "familiar" && (
                <>
                  <DropdownMenuItem className="text-base cursor-pointer" onClick={handleChangeProfile}>
                    <Users className="mr-2 h-4 w-4" />
                    Cambiar perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-base cursor-pointer" onClick={handleChangeRole}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Cambiar rol
                  </DropdownMenuItem>
                </>
              )}
              {authState.role === "hogar" && (
                <DropdownMenuItem className="text-base cursor-pointer" onClick={handleChangeRole}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Cambiar rol
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-base cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  )
}
