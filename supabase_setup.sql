-- À exécuter dans Supabase: Dashboard → SQL Editor → New query

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  project_type text not null,
  message text not null
);

alter table public.leads enable row level security;

-- Autorise l'insertion depuis le site (clé publique), mais pas la lecture
create policy "Allow public inserts on leads"
  on public.leads
  for insert
  to anon
  with check (true);
