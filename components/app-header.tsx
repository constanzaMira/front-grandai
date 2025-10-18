"use client"

import { Menu, User } from "lucide-react"
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

interface AppHeaderProps {
  elderName?: string
  onMenuClick?: () => void
}

export function AppHeader({ elderName = "Nélida", onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground">Grand AI</h1>
            <p className="text-sm text-muted-foreground">Plan de {elderName}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-full">
              <Avatar className="h-11 w-11">
                <AvatarImage src="/placeholder.svg?height=44&width=44" alt="Usuario" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none">Familiar</p>
                <p className="text-sm leading-none text-muted-foreground">familiar@ejemplo.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-base">Perfil del adulto</DropdownMenuItem>
            <DropdownMenuItem className="text-base">Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-base">Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
