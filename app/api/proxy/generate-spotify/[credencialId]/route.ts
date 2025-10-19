import { NextResponse } from "next/server"

export async function POST(_req: Request, { params }: { params: { credencialId: string } }) {
  const { credencialId } = params
  const url = `https://backend-grand.onrender.com/backend/contenidos/generar_spotify/${encodeURIComponent(credencialId)}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // empty body
      cache: "no-store",
    })
    const text = await res.text()

    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text }
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.error || data?.details || `Upstream ${res.status}: ${res.statusText}`,
        },
        { status: res.status },
      )
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Proxy fetch failed" }, { status: 502 })
  }
}
