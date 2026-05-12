import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { TOTAL_INTIMACY } from "@/lib/intimacy-questions";

export async function GET() {
  const sb = createServerClient();

  const [answersRes, unlockedRes] = await Promise.all([
    sb.from("intimacy_answers").select("person, question_id"),
    sb.from("together_unlocked").select("section").eq("section", "intimacy").maybeSingle(),
  ]);

  if (answersRes.error) {
    return NextResponse.json({ error: answersRes.error.message }, { status: 500 });
  }

  const answers = answersRes.data ?? [];
  const maryIds = answers.filter((a) => a.person === "mary").map((a) => a.question_id);
  const mdIds = answers.filter((a) => a.person === "md").map((a) => a.question_id);

  return NextResponse.json({
    mary: { answered_ids: maryIds, count: maryIds.length, total: TOTAL_INTIMACY },
    md: { answered_ids: mdIds, count: mdIds.length, total: TOTAL_INTIMACY },
    both_complete: maryIds.length >= TOTAL_INTIMACY && mdIds.length >= TOTAL_INTIMACY,
    is_unlocked: !!unlockedRes.data,
  });
}
