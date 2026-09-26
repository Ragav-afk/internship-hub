create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  internship_id uuid not null references internships (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, internship_id)
);

alter table favorites enable row level security;

create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);
