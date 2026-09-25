create table internships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  description text,
  field text not null,
  city text not null,
  work_mode text not null check (work_mode in ('Remote', 'On-site', 'Hybrid')),
  stipend_min integer,
  stipend_max integer,
  stipend_note text,
  duration text,
  apply_url text,
  source text,
  posted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table internships enable row level security;

create policy "Internships are publicly readable"
  on internships
  for select
  using (true);
