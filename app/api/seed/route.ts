import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const CONNECTION_QUESTIONS = [
  // memories
  "m1", "m2", "m3", "m4",
  // right-now
  "rn1", "rn2", "rn3", "rn4",
  // us
  "u1", "u2", "u3", "u4",
  // forward
  "f1", "f2", "f3", "f4",
];

const INTIMACY_QUESTIONS = [
  { id: "i1",  kind: "open"   },
  { id: "i2",  kind: "choice" },
  { id: "i3",  kind: "open"   },
  { id: "i4",  kind: "choice" },
  { id: "i5",  kind: "open"   },
  { id: "i6",  kind: "choice" },
  { id: "i7",  kind: "open"   },
  { id: "i8",  kind: "choice" },
  { id: "i9",  kind: "open"   },
  { id: "i10", kind: "open"   },
  { id: "i11", kind: "choice" },
  { id: "i12", kind: "open"   },
  { id: "i13", kind: "choice" },
  { id: "i14", kind: "open"   },
  { id: "i15", kind: "open"   },
  { id: "i16", kind: "choice" },
  { id: "i17", kind: "open"   },
  { id: "i18", kind: "choice" },
  { id: "i19", kind: "open"   },
  { id: "i20", kind: "open"   },
  { id: "i22", kind: "open"   },
  { id: "i23", kind: "choice" },
  { id: "i24", kind: "open"   },
  { id: "i25", kind: "open"   },
  { id: "i26", kind: "choice" },
  { id: "i27", kind: "open"   },
];

const EXPLORATION_ITEMS = [
  "a1","a2","a3","a4","a5","a6","a7","a8","a9",
  "s1","s2","s3","s4","s5","s6","s7",
  "c1","c2","c3","c4","c5","c6","c7",
  "f1","f2","f3","f4","f5","f6","f7","f8",
  "p1","p2","p3","p4","p5","p6","p7","p8",
  "n1","n2","n3","n4","n5","n6","n7",
  "z1","z2","z3","z4","z5","z6",
];

const PERSONS = ["md", "mary"] as const;

export async function POST() {
  const sb = createServerClient();

  const connectionRows = PERSONS.flatMap((person) =>
    CONNECTION_QUESTIONS.map((qid) => ({
      person,
      question_id: qid,
      answer_text: "Test answer for " + qid,
      selected_option: null,
    }))
  );

  const intimacyRows = PERSONS.flatMap((person) =>
    INTIMACY_QUESTIONS.map((q) => ({
      person,
      question_id: q.id,
      answer_text: q.kind === "open" ? "Test answer for " + q.id : null,
      selected_option: q.kind === "choice" ? "Option A" : null,
    }))
  );

  const explorationRows = PERSONS.flatMap((person) =>
    EXPLORATION_ITEMS.map((itemId) => ({
      person,
      item_id: itemId,
      response: "yes" as const,
      comment: null,
    }))
  );

  const [connErr, intimErr, explErr] = await Promise.all([
    sb.from("connection_answers")
      .upsert(connectionRows, { onConflict: "person,question_id" })
      .then((r) => r.error),
    sb.from("intimacy_answers")
      .upsert(intimacyRows, { onConflict: "person,question_id" })
      .then((r) => r.error),
    sb.from("exploration_answers")
      .upsert(explorationRows, { onConflict: "person,item_id" })
      .then((r) => r.error),
  ]);

  const errors = [connErr, intimErr, explErr].filter(Boolean);
  if (errors.length) {
    return NextResponse.json({ error: errors.map((e) => e!.message).join("; ") }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
