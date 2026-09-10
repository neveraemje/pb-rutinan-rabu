alter table public.club_state
  drop constraint if exists club_state_not_empty;

alter table public.club_state
  add constraint club_state_not_empty check (
    jsonb_array_length(coalesce(data->'members', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(data->'sessions', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(data->'payments', '[]'::jsonb)) > 0
    or jsonb_array_length(coalesce(data->'expenses', '[]'::jsonb)) > 0
  );
