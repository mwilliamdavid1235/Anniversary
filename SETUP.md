# Anniversary Trip — Setup Guide

## 1. Local development

```bash
cp .env.example .env.local
# Fill in your credentials (see sections below)

npm run dev
# → http://localhost:3000
```

---

## 2. Supabase

1. Go to your Supabase project → **SQL Editor**
2. Paste and run `supabase/schema.sql`
3. Copy your **Project URL** and **anon key** from Project Settings → API
4. Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # optional, for writes
```

The site currently reads from `lib/data.ts` (hardcoded). When you're ready to go database-driven, switch `lib/data.ts` to fetch from Supabase using the client in `lib/supabase.ts`.

---

## 3. Spotify

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create a new app (any name)
3. Add `http://localhost:3000` as a Redirect URI
4. Copy **Client ID** and **Client Secret**
5. Add to `.env.local`:

```
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
```

The playlist feature uses Client Credentials (no user login needed) to search Spotify's public playlists. Each playlist card has a **"Find on Spotify"** button — tap it and a real embedded Spotify player appears inline.

---

## 4. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# From the project folder:
vercel

# Follow the prompts, then add env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
```

Or add them in the Vercel dashboard under Project → Settings → Environment Variables.

Once deployed, point your **pecanandpoplar.com** domain at Vercel:
- Vercel Dashboard → Project → Settings → Domains → Add `pecanandpoplar.com`
- Update your DNS at your registrar: add a CNAME pointing to `cname.vercel-dns.com`

---

## 5. Filling in real content

All trip content lives in `lib/data.ts`. Replace the placeholder data:
- Update `startDate` / `endDate`
- Fill in real hotel names, addresses, confirmation numbers
- Replace `href: "#"` links with real URLs
- Update Waze links — the `?q=` param accepts any address or place name
- The `note` field shows as a green confirmation bar inside the card

For each event with a `playlist`, the Spotify search query is in `playlist.spotifyQuery` — tune these to match the vibe you want.

---

## Design

- **Fonts**: Instrument Serif (display/italic) + DM Mono (functional text)
- **Palette**: Dark forest green base, warm champagne text, gold accents
- **"Up Next"**: Auto-detects current time and highlights the upcoming event with a live pulse
- **Day nav**: Auto-selects the correct day based on today's date
- **Playlists**: Lazy-loaded Spotify embeds, one per travel/dining/activity moment
