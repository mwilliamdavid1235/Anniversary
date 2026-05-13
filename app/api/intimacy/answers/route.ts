import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const person = req.nextUrl.searchParams.get("person");
  if (!person || (person !== "mary" && person !== "md")) {
    return NextResponse.json({ error: "Invalid person" }, { status: 400 });
  }

  const sb = createServerClient();
  const { data, error } = await sb
    .from("intimacy_answers")
    .select("question_id, answer_text, selected_option, updated_at")
    .eq("person", person);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ answers: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { person, question_id, answer_text, selected_option } = body;

  if (!person || (person !== "mary" && person !== "md")) {
    return NextResponse.json({ error: "Invalid person" }, { status: 400 });
  }
  if (!question_id) {
    return NextResponse.json({ error: "Missing question_id" }, { status: 400 });
  }

  const sb = createServerClient();
  const { error } = await sb.from("intimacy_answers").upsert(
    { person, question_id, answer_text: answer_text ?? null, selected_option: selected_option ?? null },
    { onConflict: "person,question_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
