import { generateText } from "ai"

export async function POST(req: Request) {
  const { interests, name, searchQuery } = await req.json()

  const prompt = searchQuery
    ? `Eres un asistente especializado en recomendar contenido multimedia para adultos mayores.

Perfil:
- Nombre: ${name}
- Intereses: ${interests}

El usuario está buscando: "${searchQuery}"

Genera 6 recomendaciones de contenido que coincidan con la búsqueda y sean apropiadas para ${name}. Incluye una mezcla de podcasts, videos, música y audiolibros.

Para cada recomendación incluye:
- Título específico y realista
- Descripción breve (2-3 oraciones)
- Tipo: "podcast", "video", "music", o "audiobook"
- Duración estimada
- Por qué es relevante para ${name} (1 oración)

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:
{
  "content": [
    {
      "id": "1",
      "title": "Título del contenido",
      "description": "Descripción del contenido",
      "type": "podcast",
      "duration": "45 min",
      "relevance": "Por qué es relevante"
    }
  ]
}

No incluyas texto adicional, solo el JSON.`
    : `Eres un asistente especializado en recomendar contenido multimedia para adultos mayores.

Perfil:
- Nombre: ${name}
- Intereses: ${interests}

Genera 12 recomendaciones personalizadas de contenido multimedia. Incluye una mezcla equilibrada de:
- 3 podcasts
- 3 videos
- 3 música/álbumes
- 3 audiolibros

Para cada recomendación incluye:
- Título específico y realista
- Descripción breve (2-3 oraciones)
- Tipo: "podcast", "video", "music", o "audiobook"
- Duración estimada
- Por qué es relevante para ${name} basado en sus intereses (1 oración)

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:
{
  "content": [
    {
      "id": "1",
      "title": "Título del contenido",
      "description": "Descripción del contenido",
      "type": "podcast",
      "duration": "45 min",
      "relevance": "Por qué es relevante"
    }
  ]
}

No incluyas texto adicional, solo el JSON.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 3000,
      temperature: 0.7,
    })

    const cleanedText = text
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
    const parsedResponse = JSON.parse(cleanedText)

    return Response.json(parsedResponse)
  } catch (error) {
    console.error("[v0] Error generating content:", error)

    // Fallback content
    const fallbackContent = {
      content: [
        {
          id: "1",
          title: "Historias de tango argentino",
          description:
            "Podcast que cuenta las historias detrás de los tangos más famosos y sus compositores. Incluye anécdotas de Gardel, Piazzolla y otros grandes.",
          type: "podcast",
          duration: "35 min",
          relevance: "Conecta con la cultura argentina y la música tradicional",
        },
        {
          id: "2",
          title: "Recetas de la abuela",
          description:
            "Serie de videos cortos donde cocineros preparan recetas tradicionales argentinas paso a paso, con tips y secretos de cocina.",
          type: "video",
          duration: "20 min",
          relevance: "Combina el interés por la cocina con la nostalgia de recetas tradicionales",
        },
        {
          id: "3",
          title: "Grandes éxitos del folklore",
          description:
            "Colección de música folklórica argentina con Mercedes Sosa, Los Chalchaleros y otros artistas clásicos.",
          type: "music",
          duration: "2 horas",
          relevance: "Música tradicional que evoca recuerdos y emociones positivas",
        },
        {
          id: "4",
          title: "Cuentos de Borges narrados",
          description: "Audiolibro con los cuentos más famosos de Jorge Luis Borges narrados con voz clara y pausada.",
          type: "audiobook",
          duration: "3 horas",
          relevance: "Literatura argentina clásica en formato accesible",
        },
        {
          id: "5",
          title: "Ejercicios para la memoria",
          description:
            "Podcast con ejercicios mentales, acertijos y técnicas para mantener la mente activa de forma entretenida.",
          type: "podcast",
          duration: "25 min",
          relevance: "Estimulación cognitiva de manera divertida y accesible",
        },
        {
          id: "6",
          title: "Documentales de naturaleza",
          description:
            "Serie de documentales sobre la naturaleza argentina: cataratas, glaciares, fauna y flora del país.",
          type: "video",
          duration: "45 min",
          relevance: "Contenido visual relajante y educativo sobre Argentina",
        },
      ],
    }

    return Response.json(fallbackContent)
  }
}
