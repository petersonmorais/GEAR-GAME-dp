-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  coins integer default 1000,
  gems integer default 0,
  level integer default 1,
  experience integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_own" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "profiles_insert_own" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "profiles_update_own" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "profiles_delete_own" 
  on public.profiles for delete 
  using (auth.uid() = id);

-- Allow users to view other profiles (for leaderboards, etc)
create policy "profiles_select_public" 
  on public.profiles for select 
  using (true);

-- Create index for username lookups
create index if not exists profiles_username_idx on public.profiles(username);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Apply trigger to profiles
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
