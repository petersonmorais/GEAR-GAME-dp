-- Create table for unique login codes
CREATE TABLE IF NOT EXISTS public.unique_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(12) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_unique_codes_code ON public.unique_codes(code);
CREATE INDEX IF NOT EXISTS idx_unique_codes_user_id ON public.unique_codes(user_id);

-- Enable RLS
ALTER TABLE public.unique_codes ENABLE ROW LEVEL SECURITY;

-- Policies for unique_codes
-- Users can read their own codes
CREATE POLICY "users_select_own_codes" ON public.unique_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own codes  
CREATE POLICY "users_insert_own_codes" ON public.unique_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own codes
CREATE POLICY "users_update_own_codes" ON public.unique_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own codes
CREATE POLICY "users_delete_own_codes" ON public.unique_codes
  FOR DELETE USING (auth.uid() = user_id);

-- Allow anonymous users to check if a code exists (for login)
CREATE POLICY "anon_can_check_codes" ON public.unique_codes
  FOR SELECT USING (true);
