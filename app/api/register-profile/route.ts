export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] API Route - Proxying request to backend:", body)

    // Make the request to the backend from the server side (no CORS issues)
    const response = await fetch("https://backend-grand.onrender.com/backend/abuelos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
      { error: "Failed to register profile", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
