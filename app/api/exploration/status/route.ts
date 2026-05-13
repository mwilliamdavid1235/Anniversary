import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { TOTAL_EXPLORATION } from "@/lib/exploration-items";

export async function GET() {
  const supabase = createServerClient();
  const [maryRes, mdRes, unlockRes] = await Promise.all([
    supabase.from("exploration_answers").select("item_id").eq("person", "mary"),
    supabase.from("exploration_answers").select("item_id").eq("person", "md"),
    supabase.from("together_unlocked").select("*").eq("section", "exploration").maybeSingle(),
  ]);

  const maryCount = maryRes.data?.length ?? 0;
  const mdCount = mdRes.data?.length ?? 0;

  return NextResponse.json({
    mary: { count: maryCount, total: TOTAL_EXPLORATION },
    md: { count: mdCount, total: TOTAL_EXPLORATION },
    both_complete: maryCount >= TOTAL_EXPLORATION && mdCount >= TOTAL_EXPLORATION,
    is_unlocked: !!unlockRes.data,
  });
}
