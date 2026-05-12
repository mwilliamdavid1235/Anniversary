-- ============================================================
--  Anniversary Trip — Supabase Schema
--  Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── trips ────────────────────────────────────────────────────
create table if not exists trips (
  id            text primary key,
  title         text not null,
  subtitle      text,
  start_date    date not null,
  end_date      date not null,
  created_at    timestamptz default now()
);

-- ── days ─────────────────────────────────────────────────────
create table if not exists days (
  id            text primary key,
  trip_id       text references trips(id) on delete cascade,
  day_number    int  not null,
  label         text not null,  -- "Friday"
  date          date not null,
  sort_order    int  default 0
);

-- ── events ───────────────────────────────────────────────────
create table if not exists events (
  id               text primary key,
  day_id           text references days(id) on delete cascade,
  time_start       time not null,
  title            text not null,
  event_type       text not null check (event_type in ('travel','lodging','restaurant','activity')),
  description      text,
  note             text,
  sort_order       int  default 0,
  created_at       timestamptz default now()
);

-- ── event_links ──────────────────────────────────────────────
create table if not exists event_links (
  id         text primary key default gen_random_uuid()::text,
  event_id   text references events(id) on delete cascade,
  label      text not null,
  href       text not null,
  kind       text not null check (kind in ('waze','website','menu','reserve','phone','tickets')),
  sort_order int  default 0
);

-- ── event_options (e.g. "pick a restaurant") ─────────────────
create table if not exists event_options (
  id          text primary key,
  event_id    text references events(id) on delete cascade,
  name        text not null,
  description text,
  sort_order  int  default 0
);

create table if not exists option_links (
  id         text primary key default gen_random_uuid()::text,
  option_id  text references event_options(id) on delete cascade,
  label      text not null,
  href       text not null,
  kind       text not null,
  sort_order int  default 0
);

-- ── playlists ─────────────────────────────────────────────────
create table if not exists playlists (
  id                  text primary key,
  event_id            text references events(id) on delete cascade,
  label               text not null,
  mood                text,
  spotify_query       text,
  spotify_playlist_id text,  -- cached Spotify playlist ID
  updated_at          timestamptz default now()
);

-- ── RLS (Row Level Security) ──────────────────────────────────
-- Since this is a private site, keep it simple — enable RLS
-- but allow reads for authenticated users only.
-- For a password-protected single-page app, you can skip RLS
-- and rely on the anon key being private.

alter table trips enable row level security;
alter table days enable row level security;
alter table events enable row level security;
alter table event_links enable row level security;
alter table event_options enable row level security;
alter table option_links enable row level security;
alter table playlists enable row level security;

-- Allow anon reads (the site is effectively private by URL obscurity)
create policy "Allow anon read trips"        on trips        for select using (true);
create policy "Allow anon read days"         on days         for select using (true);
create policy "Allow anon read events"       on events       for select using (true);
create policy "Allow anon read event_links"  on event_links  for select using (true);
create policy "Allow anon read options"      on event_options for select using (true);
create policy "Allow anon read option_links" on option_links  for select using (true);
create policy "Allow anon read playlists"    on playlists    for select using (true);
