import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { person } = await req.json();
  if (!person) return NextResponse.json({ error: "Missing person" }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase
    .from("together_unlocked")
    .upsert({ section: "exploration", unlocked_by: person }, { onConflict: "section" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
