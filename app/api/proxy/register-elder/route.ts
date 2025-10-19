import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const res = await fetch("https://backend-grand.onrender.com/backend/abuelos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Proxy fetch failed" }, { status: 502 })
  }
}
