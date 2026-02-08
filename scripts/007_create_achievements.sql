-- Create user_achievements table
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null,
  progress integer default 0,
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Enable Row Level Security
alter table public.user_achievements enable row level security;

-- RLS Policies for user_achievements
create policy "user_achievements_select_own" 
  on public.user_achievements for select 
  using (auth.uid() = user_id);

create policy "user_achievements_insert_own" 
  on public.user_achievements for insert 
  with check (auth.uid() = user_id);

create policy "user_achievements_update_own" 
  on public.user_achievements for update 
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists user_achievements_user_id_idx on public.user_achievements(user_id);
create index if not exists user_achievements_completed_idx on public.user_achievements(completed);

-- Apply updated_at trigger
create trigger user_achievements_updated_at
  before update on public.user_achievements
  for each row
  execute function public.handle_updated_at();
