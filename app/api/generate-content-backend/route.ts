export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const credencialId = searchParams.get("credencial_id")

    if (!credencialId) {
      return Response.json({ error: "credencial_id is required" }, { status: 400 })
    }

    console.log("[v0] API Route - Generating content for credencial_id:", credencialId)

    const response = await fetch(`https://backend-grand.onrender.com/backend/contenidos/generar/${credencialId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] API Route - Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API Route - Backend error:", errorText)
      return Response.json({ error: "Backend error", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] API Route - Backend response data:", data)

    return Response.json(data)
  } catch (error) {
    console.error("[v0] API Route - Error:", error)
    return Response.json(
      { error: "Failed to generate content", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
