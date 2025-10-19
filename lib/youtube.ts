export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")

    // youtube.com or m.youtube.com
    if (host.endsWith("youtube.com") || host === "m.youtube.com") {
      // Check for v parameter in query string
      const v = u.searchParams.get("v")
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v

      // Check for embed or shorts format
      const parts = u.pathname.split("/").filter(Boolean)
      const i = parts[0] === "embed" || parts[0] === "shorts" ? parts[1] : null
      if (i && /^[A-Za-z0-9_-]{11}$/.test(i)) return i
    }

    // youtu.be short links
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0] || ""
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id
    }
  } catch {}

  return null
}

export function getYouTubeThumbnail(
  id: string,
  quality: "maxresdefault" | "sddefault" | "hqdefault" = "maxresdefault",
) {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`
}
