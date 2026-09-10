create table if not exists public.club_state_history (
  id bigint generated always as identity primary key,
  club_state_id text not null,
  data jsonb not null,
  archived_at timestamptz not null default now()
);

alter table public.club_state_history enable row level security;

create or replace function public.archive_club_state()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.club_state_history (club_state_id, data, archived_at)
  values (old.id, old.data, now());
  return new;
end;
$$;

drop trigger if exists archive_club_state_trigger on public.club_state;

create trigger archive_club_state_trigger
before update or delete on public.club_state
for each row execute function public.archive_club_state();
