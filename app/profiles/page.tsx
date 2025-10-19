"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, LogOut } from "lucide-react"
import { auth } from "@/lib/auth"

// Mock profiles data
const mockProfiles = [
  { id: "nelida-78", name: "Nélida", age: 78, initials: "N" },
  { id: "hector-81", name: "Héctor", age: 81, initials: "H" },
]

export default function ProfilesPage() {
  const router = useRouter()

  const handleSelectProfile = (profileId: string) => {
    auth.setProfileId(profileId)
    router.push("/inicio")
  }

  const handleLogout = () => {
    auth.clear()
    router.push("/login")
  }

  const handleChangeRole = () => {
    auth.setRole(null)
    auth.setProfileId(null)
    router.push("/role")
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Grand AI</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleChangeRole}>
              Cambiar rol
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Elegí el perfil</h2>
            <p className="text-muted-foreground text-lg">Podés gestionar más de un adulto por cuenta</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleSelectProfile(profile.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                      {profile.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-xl font-semibold">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.age} años</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold">Agregar perfil</p>
                  <p className="text-sm text-muted-foreground">Nuevo adulto mayor</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
