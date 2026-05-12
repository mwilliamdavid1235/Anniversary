import { NextRequest, NextResponse } from "next/server";
import { searchPlaylists } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "5", 10);

  if (!query) {
    return NextResponse.json({ error: "Missing query param: q" }, { status: 400 });
  }

  try {
    const results = await searchPlaylists(query, limit);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[spotify/search]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
