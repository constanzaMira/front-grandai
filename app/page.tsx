"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8 rounded-full bg-primary/10 p-6">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>

          <h1 className="mb-4 text-4xl font-bold text-foreground">Bienvenido a Grand AI</h1>

          <p className="mb-8 max-w-md text-lg text-muted-foreground leading-relaxed">
            Configurá el perfil de tu ser querido y la IA generará automáticamente contenido personalizado: videos,
            podcasts y eventos que le van a encantar.
          </p>

          <Link href="/login">
            <Button size="lg" className="min-h-[52px] px-8 text-lg font-semibold">
              <Sparkles className="mr-2 h-5 w-5" />
              Comenzar
            </Button>
          </Link>

          <Card className="mt-12 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl">¿Qué vas a poder hacer?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-base">Contenido personalizado con IA</p>
                  <p className="text-sm text-muted-foreground">Videos, podcasts y eventos generados según sus gustos</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-base">Descubrir y programar contenido</p>
                  <p className="text-sm text-muted-foreground">Podcasts, videos, música y audiolibros adaptados</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-base">Agendar eventos cercanos</p>
                  <p className="text-sm text-muted-foreground">Bingo, talleres, misa y actividades del barrio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
