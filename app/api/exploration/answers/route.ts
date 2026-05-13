import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const person = req.nextUrl.searchParams.get("person");
  if (!person) return NextResponse.json({ error: "Missing person" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("exploration_answers")
    .select("item_id, response, comment")
    .eq("person", person);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ answers: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { person, item_id, response, comment } = body;

  if (!person || !item_id || !response) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("exploration_answers")
    .upsert(
      { person, item_id, response, comment: comment ?? null },
      { onConflict: "person,item_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
