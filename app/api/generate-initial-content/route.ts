import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const profile = await request.json()

    const prompt = `Sos un asistente experto en recomendar contenido para adultos mayores.

Perfil del adulto mayor:
- Nombre: ${profile.name}
- Edad: ${profile.age} años
- Intereses: ${profile.interests}
- Movilidad: ${profile.mobility}
- Rutina: ${profile.schedule || "No especificada"}
- Preferencias: ${profile.preferences || "No especificadas"}

Tu tarea es generar contenido personalizado en español (rioplatense neutral) para esta persona:

1. 5 videos de YouTube reales y específicos (con títulos, canales, duración aproximada y razón por la que le gustaría)
2. 5 podcasts de Spotify reales (con títulos, hosts, duración y razón)
3. 5 eventos locales cercanos (actividades como bingo, talleres, misa, tejido, etc. basados en sus intereses)

Formato de respuesta JSON:
{
  "videos": [
    {
      "title": "Título del video",
      "channel": "Nombre del canal",
      "duration": "15 min",
      "reason": "Por qué le gustaría este video",
      "url": "https://youtube.com/..."
    }
  ],
  "podcasts": [
    {
      "title": "Título del podcast",
      "host": "Nombre del host",
      "duration": "30 min",
      "reason": "Por qué le gustaría este podcast",
      "platform": "Spotify"
    }
  ],
  "events": [
    {
      "title": "Nombre del evento",
      "location": "Lugar específico",
      "date": "Fecha",
      "time": "Horario",
      "reason": "Por qué le interesaría",
      "type": "bingo|taller|misa|social"
    }
  ]
}

Asegurate de que todo el contenido sea apropiado, accesible y relevante para sus intereses.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    let content

    if (jsonMatch) {
      content = JSON.parse(jsonMatch[0])
    } else {
      // Fallback content if AI fails
      content = {
        videos: [
          {
            title: "Historia del Tango Argentino - Documental Completo",
            channel: "Historia Argentina",
            duration: "45 min",
            reason: "Combina su amor por el tango con historia cultural",
            url: "https://youtube.com/watch?v=example1",
          },
          {
            title: "Recetas Tradicionales Uruguayas",
            channel: "Cocina del Río de la Plata",
            duration: "20 min",
            reason: "Recetas de su región que puede disfrutar",
            url: "https://youtube.com/watch?v=example2",
          },
          {
            title: "Peñarol: Los Mejores Momentos Históricos",
            channel: "Fútbol Uruguayo",
            duration: "30 min",
            reason: "Revive los mejores momentos de su equipo favorito",
            url: "https://youtube.com/watch?v=example3",
          },
          {
            title: "Técnicas de Tejido para Principiantes",
            channel: "Manualidades con Amor",
            duration: "15 min",
            reason: "Aprende nuevas técnicas para su hobby favorito",
            url: "https://youtube.com/watch?v=example4",
          },
          {
            title: "Música Clásica Rioplatense",
            channel: "Música del Sur",
            duration: "1 hora",
            reason: "Música relajante de su región",
            url: "https://youtube.com/watch?v=example5",
          },
        ],
        podcasts: [
          {
            title: "Historias del Barrio",
            host: "María González",
            duration: "35 min",
            reason: "Relatos nostálgicos de la vida en Montevideo",
            platform: "Spotify",
          },
          {
            title: "Tango y Milonga",
            host: "Carlos Gardel Jr.",
            duration: "40 min",
            reason: "Todo sobre la música que ama",
            platform: "Spotify",
          },
          {
            title: "Recetas de la Abuela",
            host: "Ana María",
            duration: "25 min",
            reason: "Cocina tradicional con historias familiares",
            platform: "Spotify",
          },
          {
            title: "Fútbol de Antaño",
            host: "Roberto Fontanarrosa",
            duration: "45 min",
            reason: "Historias del fútbol uruguayo clásico",
            platform: "Spotify",
          },
          {
            title: "Manualidades y Tejido",
            host: "Laura Pérez",
            duration: "30 min",
            reason: "Tips y técnicas para tejer",
            platform: "Spotify",
          },
        ],
        events: [
          {
            title: "Bingo Comunitario",
            location: "Centro Vecinal Pocitos",
            date: "Todos los jueves",
            time: "15:00",
            reason: "Actividad social divertida en su barrio",
            type: "bingo",
          },
          {
            title: "Taller de Tejido",
            location: "Casa de la Cultura",
            date: "Martes y viernes",
            time: "10:00",
            reason: "Comparte su pasión con otras personas",
            type: "taller",
          },
          {
            title: "Misa Dominical",
            location: "Parroquia San José",
            date: "Todos los domingos",
            time: "11:00",
            reason: "Encuentro espiritual semanal",
            type: "misa",
          },
          {
            title: "Tarde de Tango",
            location: "Club Social Montevideo",
            date: "Sábados",
            time: "17:00",
            reason: "Disfruta de música en vivo de tango",
            type: "social",
          },
          {
            title: "Encuentro de Cocina Tradicional",
            location: "Centro Comunitario",
            date: "Primer miércoles del mes",
            time: "14:00",
            reason: "Comparte y aprende recetas tradicionales",
            type: "taller",
          },
        ],
      }
    }

    return Response.json({ content })
  } catch (error) {
    console.error("Error generating initial content:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
