import { generateText } from "ai"

export async function POST(req: Request) {
  const { interests, mobility, name, location } = await req.json()

  const prompt = `Eres un asistente especializado en encontrar eventos y actividades para adultos mayores.

Perfil:
- Nombre: ${name}
- Intereses: ${interests}
- Movilidad: ${mobility}
- Ubicación: ${location}

Genera 9 eventos y actividades cercanas apropiadas para ${name}. Incluye una mezcla de:
- Bingo y juegos
- Talleres (manualidades, cocina, arte)
- Misas y actividades religiosas
- Eventos sociales (bailes, reuniones)
- Ejercicio y actividades físicas adaptadas

Para cada evento incluye:
- Título específico
- Descripción breve (2 oraciones)
- Tipo: "bingo", "taller", "misa", "social", o "ejercicio"
- Fecha (próximos 7 días, formato: "Lunes 20 de Enero")
- Hora (formato: "10:00 - 12:00")
- Ubicación específica (nombre del lugar y dirección en ${location})
- Distancia aproximada (ej: "A 500m", "A 1.2km")

Considera la movilidad de ${name} (${mobility}) al sugerir eventos.

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido en este formato exacto:
{
  "events": [
    {
      "id": "1",
      "title": "Título del evento",
      "description": "Descripción del evento",
      "type": "bingo",
      "date": "Lunes 20 de Enero",
      "time": "10:00 - 12:00",
      "location": "Centro Comunitario San Martín, Av. Corrientes 1234",
      "distance": "A 500m"
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
    console.error("[v0] Error generating events:", error)

    // Fallback events
    const fallbackEvents = {
      events: [
        {
          id: "1",
          title: "Bingo de la tarde",
          description:
            "Bingo tradicional con premios y merienda incluida. Ambiente familiar y amigable para todas las edades.",
          type: "bingo",
          date: "Martes 21 de Enero",
          time: "15:00 - 17:00",
          location: "Club de Jubilados, Av. Rivadavia 5678",
          distance: "A 800m",
        },
        {
          id: "2",
          title: "Taller de tejido",
          description:
            "Aprende nuevas técnicas de tejido y comparte con otras personas. Materiales incluidos para principiantes.",
          type: "taller",
          date: "Miércoles 22 de Enero",
          time: "10:00 - 12:00",
          location: "Centro Cultural del Barrio, Calle Falsa 123",
          distance: "A 1.2km",
        },
        {
          id: "3",
          title: "Misa dominical",
          description: "Misa tradicional seguida de café y charla comunitaria. Todos son bienvenidos.",
          type: "misa",
          date: "Domingo 26 de Enero",
          time: "11:00 - 12:30",
          location: "Parroquia San José, Av. San Martín 890",
          distance: "A 600m",
        },
        {
          id: "4",
          title: "Baile de tango",
          description:
            "Tarde de tango con orquesta en vivo. No es necesario saber bailar, hay instructores disponibles.",
          type: "social",
          date: "Viernes 24 de Enero",
          time: "18:00 - 21:00",
          location: "Salón Comunitario La Milonga, Calle Corrientes 2345",
          distance: "A 1.5km",
        },
        {
          id: "5",
          title: "Gimnasia suave",
          description:
            "Clase de ejercicios adaptados para adultos mayores. Mejora flexibilidad y equilibrio de forma segura.",
          type: "ejercicio",
          date: "Lunes 20 de Enero",
          time: "09:00 - 10:00",
          location: "Plaza del Barrio, Parque Centenario",
          distance: "A 400m",
        },
        {
          id: "6",
          title: "Taller de cocina tradicional",
          description: "Aprende a preparar recetas argentinas clásicas. Degustación incluida al finalizar la clase.",
          type: "taller",
          date: "Jueves 23 de Enero",
          time: "14:00 - 16:00",
          location: "Centro de Día Municipal, Av. Belgrano 3456",
          distance: "A 900m",
        },
      ],
    }

    return Response.json(fallbackEvents)
  }
}
