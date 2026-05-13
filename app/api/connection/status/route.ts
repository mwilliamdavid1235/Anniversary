import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { TOTAL_CONNECTION } from "@/lib/connection-questions";

export async function GET() {
  const sb = createServerClient();

  const [answersRes, unlockedRes] = await Promise.all([
    sb.from("connection_answers").select("person, question_id"),
    sb.from("together_unlocked").select("section").eq("section", "connection").maybeSingle(),
  ]);

  if (answersRes.error) {
    return NextResponse.json({ error: answersRes.error.message }, { status: 500 });
  }

  const answers = answersRes.data ?? [];
  const maryIds = answers.filter((a) => a.person === "mary").map((a) => a.question_id);
  const mdIds = answers.filter((a) => a.person === "md").map((a) => a.question_id);

  return NextResponse.json({
    mary: { answered_ids: maryIds, count: maryIds.length, total: TOTAL_CONNECTION },
    md: { answered_ids: mdIds, count: mdIds.length, total: TOTAL_CONNECTION },
    both_complete: maryIds.length >= TOTAL_CONNECTION && mdIds.length >= TOTAL_CONNECTION,
    is_unlocked: !!unlockedRes.data,
  });
}
