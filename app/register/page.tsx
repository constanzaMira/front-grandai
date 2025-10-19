"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Grand AI</CardTitle>
            <CardDescription className="text-base mt-2">Crear cuenta</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Nombre completo
              </Label>
              <Input id="name" type="text" placeholder="Tu nombre" className="h-12 text-base" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input id="email" type="email" placeholder="tu@email.com" className="h-12 text-base" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">
                Contraseña
              </Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-12 text-base" />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Crear cuenta
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tenés cuenta? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
