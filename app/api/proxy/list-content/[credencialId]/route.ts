import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { credencialId: string } }) {
  try {
    const { credencialId } = params

    console.log(`[v0] Fetching content for credencial_id: ${credencialId}`)

    const response = await fetch(`https://backend-grand.onrender.com/backend/contenidos/${credencialId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    console.log(`[v0] Backend response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] Backend error: ${errorText}`)
      throw new Error(`Backend returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`[v0] Content fetched successfully, items count: ${data.length}`)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content from backend" }, { status: 500 })
  }
}
