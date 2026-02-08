-- Create user_cards table (cards owned by users)
create table if not exists public.user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id text not null,
  quantity integer default 1 check (quantity >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

-- Enable Row Level Security
alter table public.user_cards enable row level security;

-- RLS Policies for user_cards
create policy "user_cards_select_own" 
  on public.user_cards for select 
  using (auth.uid() = user_id);

create policy "user_cards_insert_own" 
  on public.user_cards for insert 
  with check (auth.uid() = user_id);

create policy "user_cards_update_own" 
  on public.user_cards for update 
  using (auth.uid() = user_id);

create policy "user_cards_delete_own" 
  on public.user_cards for delete 
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists user_cards_user_id_idx on public.user_cards(user_id);
create index if not exists user_cards_card_id_idx on public.user_cards(card_id);

-- Apply updated_at trigger
create trigger user_cards_updated_at
  before update on public.user_cards
  for each row
  execute function public.handle_updated_at();
