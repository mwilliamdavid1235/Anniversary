import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { TOTAL_CONNECTION } from "@/lib/connection-questions";

export async function POST(req: NextRequest) {
  const { person } = await req.json();
  if (!person || (person !== "mary" && person !== "md")) {
    return NextResponse.json({ error: "Invalid person" }, { status: 400 });
  }

  const sb = createServerClient();

  // Verify both people have answered all questions before unlocking
  const { data: answers } = await sb
    .from("connection_answers")
    .select("person, question_id");

  const maryCount = (answers ?? []).filter((a) => a.person === "mary").length;
  const mdCount = (answers ?? []).filter((a) => a.person === "md").length;

  if (maryCount < TOTAL_CONNECTION || mdCount < TOTAL_CONNECTION) {
    return NextResponse.json({ error: "Both people must complete all questions first" }, { status: 403 });
  }

  const { error } = await sb
    .from("together_unlocked")
    .upsert({ section: "connection", unlocked_by: person }, { onConflict: "section" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
