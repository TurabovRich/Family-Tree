-- Family Tree schema.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query)
-- for a fresh project, before running seed.sql.

create extension if not exists pgcrypto;

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  gender text check (gender in ('male', 'female')),
  birth_year int,
  death_year int,
  photo_url text,
  notes text,
  needs_review boolean not null default false,
  father_id uuid references people(id) on delete set null,
  mother_id uuid references people(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists people_father_id_idx on people(father_id);
create index if not exists people_mother_id_idx on people(mother_id);

create table if not exists spouses (
  person_id uuid not null references people(id) on delete cascade,
  spouse_id uuid not null references people(id) on delete cascade,
  status text not null default 'married' check (status in ('married', 'divorced')),
  primary key (person_id, spouse_id),
  check (person_id <> spouse_id)
);

-- The site (using the public anon key) only ever needs to SELECT. All
-- add/edit/delete happens directly in the Supabase dashboard, which uses
-- the project's service role and therefore bypasses RLS entirely.
-- No insert/update/delete policy is created for anon on purpose.
alter table people enable row level security;
alter table spouses enable row level security;

drop policy if exists "public read people" on people;
create policy "public read people" on people
  for select
  using (true);

drop policy if exists "public read spouses" on spouses;
create policy "public read spouses" on spouses
  for select
  using (true);

-- Storage bucket for photos: public read, no public write policy.
-- Upload photos via Dashboard -> Storage -> photos -> Upload, then copy
-- the file's public URL into the person's photo_url column.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos" on storage.objects
  for select
  using (bucket_id = 'photos');
