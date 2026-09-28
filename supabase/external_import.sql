-- Run this manually in the Supabase SQL editor, same as seed.sql and
-- favorites.sql. Adds the columns the Greenhouse/Lever/Ashby importer needs.

alter table internships
  add column external_id text,
  add column is_active boolean not null default true,
  add column last_seen_at timestamptz not null default now(),
  add column currency text not null default 'INR',
  add column country text;

-- A plain (non-partial) unique constraint - Postgres already treats every
-- null as distinct from every other null, so this still lets all the
-- hand-seeded rows keep external_id = null without colliding, while
-- preventing the importer from inserting the same source listing twice.
-- (A partial index with `where external_id is not null` looks tempting here
-- but Supabase's .upsert(rows, { onConflict: "source,external_id" }) can't
-- target it - PostgREST emits a plain ON CONFLICT (source, external_id),
-- which only matches a full unique constraint, not a partial index.)
alter table internships
  add constraint internships_source_external_id_key unique (source, external_id);
