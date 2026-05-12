-- ============================================================
--  Anniversary Trip — Connection & Intimacy Sections Schema
--  Run this in your Supabase SQL editor after schema.sql
-- ============================================================

-- ── connection_answers ────────────────────────────────────────
create table if not exists connection_answers (
  id             uuid primary key default gen_random_uuid(),
  person         text not null check (person in ('mary', 'md')),
  question_id    text not null,
  answer_text    text,
  selected_option text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique(person, question_id)
);

-- ── intimacy_answers ──────────────────────────────────────────
create table if not exists intimacy_answers (
  id             uuid primary key default gen_random_uuid(),
  person         text not null check (person in ('mary', 'md')),
  question_id    text not null,
  answer_text    text,
  selected_option text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique(person, question_id)
);

-- ── guided_experience_answers ─────────────────────────────────
create table if not exists guided_experience_answers (
  id          uuid primary key default gen_random_uuid(),
  person      text not null check (person in ('mary', 'md')),
  act         int not null,
  question_id text not null,
  answer_text text,
  created_at  timestamptz default now(),
  unique(person, act, question_id)
);

-- ── exploration_answers ───────────────────────────────────────
create table if not exists exploration_answers (
  id          uuid primary key default gen_random_uuid(),
  person      text not null check (person in ('mary', 'md')),
  item_id     text not null,
  response    text not null check (response in ('yes','curious','conditions','need_info','fantasy_only','no')),
  comment     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(person, item_id)
);

-- ── together_unlocked ─────────────────────────────────────────
-- Drop old constraint before adding exploration support
alter table together_unlocked drop constraint if exists together_unlocked_section_check;

create table if not exists together_unlocked (
  section      text primary key check (section in ('connection', 'intimacy', 'exploration', 'guided')),
  unlocked_at  timestamptz default now(),
  unlocked_by  text check (unlocked_by in ('mary', 'md'))
);

-- If the table already exists, add the exploration value to the constraint
alter table together_unlocked
  add constraint together_unlocked_section_check
  check (section in ('connection', 'intimacy', 'exploration', 'guided'));

-- ── RLS ───────────────────────────────────────────────────────
alter table connection_answers        enable row level security;
alter table intimacy_answers          enable row level security;
alter table guided_experience_answers enable row level security;
alter table together_unlocked         enable row level security;
alter table exploration_answers       enable row level security;

-- Allow anon reads and writes (privacy enforced at API layer)
create policy "Allow anon read connection_answers"  on connection_answers      for select using (true);
create policy "Allow anon write connection_answers" on connection_answers      for all    using (true);

create policy "Allow anon read intimacy_answers"    on intimacy_answers        for select using (true);
create policy "Allow anon write intimacy_answers"   on intimacy_answers        for all    using (true);

create policy "Allow anon read guided_answers"      on guided_experience_answers for select using (true);
create policy "Allow anon write guided_answers"     on guided_experience_answers for all    using (true);

create policy "Allow anon read together_unlocked"   on together_unlocked       for select using (true);
create policy "Allow anon write together_unlocked"  on together_unlocked       for all    using (true);

create policy "Allow anon read exploration_answers"  on exploration_answers     for select using (true);
create policy "Allow anon write exploration_answers" on exploration_answers     for all    using (true);

-- ── Trigger: auto-update updated_at ──────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger connection_answers_updated_at
  before update on connection_answers
  for each row execute function update_updated_at();

create trigger intimacy_answers_updated_at
  before update on intimacy_answers
  for each row execute function update_updated_at();

create trigger exploration_answers_updated_at
  before update on exploration_answers
  for each row execute function update_updated_at();
