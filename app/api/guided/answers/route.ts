import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET: fetch all answers for a given act (both people — guided is collaborative)
export async function GET(req: NextRequest) {
  const act = req.nextUrl.searchParams.get("act");
  if (!act) return NextResponse.json({ error: "Missing act" }, { status: 400 });

  const sb = createServerClient();
  const { data, error } = await sb
    .from("guided_experience_answers")
    .select("person, act, question_id, answer_text, created_at")
    .eq("act", parseInt(act));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ answers: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { person, act, question_id, answer_text } = body;

  if (!person || (person !== "mary" && person !== "md")) {
    return NextResponse.json({ error: "Invalid person" }, { status: 400 });
  }
  if (!act || !question_id) {
    return NextResponse.json({ error: "Missing act or question_id" }, { status: 400 });
  }

  const sb = createServerClient();
  const { error } = await sb.from("guided_experience_answers").upsert(
    { person, act, question_id, answer_text: answer_text ?? null },
    { onConflict: "person,act,question_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
