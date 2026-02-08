-- Create gacha_history table (pack opening history)
create table if not exists public.gacha_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pack_type text not null,
  cards_pulled jsonb not null default '[]'::jsonb,
  cost_coins integer default 0,
  cost_gems integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.gacha_history enable row level security;

-- RLS Policies for gacha_history
create policy "gacha_history_select_own" 
  on public.gacha_history for select 
  using (auth.uid() = user_id);

create policy "gacha_history_insert_own" 
  on public.gacha_history for insert 
  with check (auth.uid() = user_id);

-- Create indexes
create index if not exists gacha_history_user_id_idx on public.gacha_history(user_id);
create index if not exists gacha_history_created_at_idx on public.gacha_history(created_at desc);
