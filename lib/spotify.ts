export function extractSpotifyTrackId(url: string): string | null {
  try {
    // Handle different Spotify URL formats:
    // https://open.spotify.com/track/3wMtrWvGIYQQp9WBjoOroy
    // https://open.spotify.com/episode/6pOHgLCS6WkkugeEFZwaIs
    const patterns = [/spotify\.com\/track\/([a-zA-Z0-9]+)/, /spotify\.com\/episode\/([a-zA-Z0-9]+)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Error extracting Spotify track ID:", error)
    return null
  }
}
