import { generateText } from "ai"

export async function POST(req: Request) {
  const { name, age, interests, mobility, schedule, preferences } = await req.json()

  const prompt = `Eres un asistente especializado en crear recomendaciones personalizadas para adultos mayores.

Información del perfil:
- Nombre: ${name}
- Edad: ${age} años
- Movilidad: ${mobility}
- Intereses y hobbies: ${interests}
${schedule ? `- Rutina diaria: ${schedule}` : ""}
${preferences ? `- Preferencias adicionales: ${preferences}` : ""}

Genera recomendaciones personalizadas en las siguientes categorías:

1. Contenido multimedia (podcasts, videos, música, audiolibros)
2. Actividades físicas adaptadas a su movilidad
3. Eventos sociales y comunitarios
4. Talleres y clases que podrían interesarle

Para cada categoría, sugiere 3-4 opciones específicas y explica brevemente por qué serían adecuadas para ${name}.

Formato de respuesta: texto claro y organizado por categorías.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({
      recommendations: text,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error generating profile:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
