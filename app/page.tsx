import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { DesktopNav } from "@/components/desktop-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader elderName="Nélida" />

      <div className="flex flex-1">
        <DesktopNav />

        <main className="flex-1 pb-20 md:pb-8">
          <div className="container max-w-4xl px-4 py-8">
            {/* Estado inicial: sin perfil configurado */}
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-8 rounded-full bg-primary/10 p-6">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>

              <h2 className="mb-4 text-3xl font-bold text-foreground">Bienvenido a Grand AI</h2>

              <p className="mb-8 max-w-md text-lg text-muted-foreground leading-relaxed">
                Configurá el perfil de tu ser querido y la IA generará automáticamente contenido personalizado: videos,
                podcasts y eventos que le van a encantar.
              </p>

              <Link href="/onboarding">
                <Button size="lg" className="min-h-[52px] px-8 text-lg font-semibold">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Comenzar configuración
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
                      <p className="text-sm text-muted-foreground">
                        Videos, podcasts y eventos generados según sus gustos
                      </p>
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
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
