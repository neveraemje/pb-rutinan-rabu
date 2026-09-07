create table if not exists public.club_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.club_state enable row level security;

drop policy if exists "club_state_public_read" on public.club_state;
create policy "club_state_public_read" on public.club_state for select to anon using (true);

drop policy if exists "club_state_public_insert" on public.club_state;
create policy "club_state_public_insert" on public.club_state for insert to anon with check (id = 'default');

drop policy if exists "club_state_public_update" on public.club_state;
create policy "club_state_public_update" on public.club_state for update to anon using (id = 'default') with check (id = 'default');

insert into public.club_state (id, data)
values ('default', '{"members":[],"sessions":[],"payments":[],"expenses":[]}'::jsonb)
on conflict (id) do update set data = excluded.data, updated_at = now();
