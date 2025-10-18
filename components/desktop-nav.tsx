"use client"

import { Home, Search, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/descubrir", label: "Descubrir contenido", icon: Search },
  { href: "/eventos", label: "Eventos cercanos", icon: Calendar },
  { href: "/actividad", label: "Actividad", icon: TrendingUp },
]

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-64 border-r border-border bg-card">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors min-h-[52px]",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
