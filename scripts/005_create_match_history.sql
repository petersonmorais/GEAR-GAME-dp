-- Create match_history table
create table if not exists public.match_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  opponent_id uuid references public.profiles(id) on delete set null,
  opponent_name text not null,
  result text not null check (result in ('win', 'loss', 'draw')),
  user_deck jsonb,
  opponent_deck jsonb,
  turns_taken integer default 0,
  match_type text not null check (match_type in ('vs_bot', 'online', 'ranked', 'friendly')),
  coins_earned integer default 0,
  experience_gained integer default 0,
  duration_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.match_history enable row level security;

-- RLS Policies for match_history
create policy "match_history_select_own" 
  on public.match_history for select 
  using (auth.uid() = user_id);

create policy "match_history_insert_own" 
  on public.match_history for insert 
  with check (auth.uid() = user_id);

-- Create indexes
create index if not exists match_history_user_id_idx on public.match_history(user_id);
create index if not exists match_history_result_idx on public.match_history(result);
create index if not exists match_history_match_type_idx on public.match_history(match_type);
create index if not exists match_history_created_at_idx on public.match_history(created_at desc);
