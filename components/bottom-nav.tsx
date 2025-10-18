"use client"

import { Home, Search, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/descubrir", label: "Descubrir", icon: Search },
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/actividad", label: "Actividad", icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[60px] min-w-[60px] flex-col items-center justify-center gap-1 px-3 py-2 text-sm transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
