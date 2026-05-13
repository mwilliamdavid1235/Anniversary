import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "active_event_id";
  const db = createServerClient();
  const { data } = await db
    .from("trip_state")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return NextResponse.json({ value: data?.value ?? null });
}

export async function POST(req: NextRequest) {
  const { key = "active_event_id", value } = await req.json();
  const db = createServerClient();
  await db.from("trip_state").upsert({ key, value, updated_at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
