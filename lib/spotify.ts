import type { SpotifyPlaylistResult } from "@/types";

// ─────────────────────────────────────────────────────────────
//  Spotify Client Credentials flow (server-side only)
//  Used to search public playlists without user auth
// ─────────────────────────────────────────────────────────────

let _tokenCache: { token: string; expiresAt: number } | null = null;

export async function getSpotifyToken(): Promise<string> {
  if (_tokenCache && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.token;
  }

  const clientId     = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const credentials  = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  _tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return _tokenCache.token;
}

export async function searchPlaylists(
  query: string,
  limit = 5
): Promise<SpotifyPlaylistResult[]> {
  const token = await getSpotifyToken();

  const params = new URLSearchParams({
    q: query,
    type: "playlist",
    limit: String(limit),
  });

  const res = await fetch(
    `https://api.spotify.com/v1/search?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 }, // cache for 1 hour
    }
  );

  if (!res.ok) {
    throw new Error(`Spotify search error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const items = data.playlists?.items ?? [];

  return items
    .filter(Boolean)
    .map((p: SpotifyRawPlaylist) => ({
      id:          p.id,
      name:        p.name,
      description: p.description ?? "",
      imageUrl:    p.images?.[0]?.url ?? "",
      externalUrl: p.external_urls?.spotify ?? `https://open.spotify.com/playlist/${p.id}`,
      trackCount:  p.tracks?.total ?? 0,
      owner:       p.owner?.display_name ?? "",
    }));
}

// Raw Spotify API type (internal)
interface SpotifyRawPlaylist {
  id: string;
  name: string;
  description?: string;
  images?: { url: string }[];
  external_urls?: { spotify: string };
  tracks?: { total: number };
  owner?: { display_name: string };
}

// Build the Spotify embed URL from a playlist ID
export function embedUrl(playlistId: string): string {
  return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
}
