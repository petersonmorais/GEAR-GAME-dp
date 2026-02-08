-- Create decks table
create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  cards jsonb not null default '[]'::jsonb,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.decks enable row level security;

-- RLS Policies for decks
create policy "decks_select_own" 
  on public.decks for select 
  using (auth.uid() = user_id);

create policy "decks_insert_own" 
  on public.decks for insert 
  with check (auth.uid() = user_id);

create policy "decks_update_own" 
  on public.decks for update 
  using (auth.uid() = user_id);

create policy "decks_delete_own" 
  on public.decks for delete 
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists decks_user_id_idx on public.decks(user_id);
create index if not exists decks_is_favorite_idx on public.decks(is_favorite);

-- Apply updated_at trigger
create trigger decks_updated_at
  before update on public.decks
  for each row
  execute function public.handle_updated_at();
