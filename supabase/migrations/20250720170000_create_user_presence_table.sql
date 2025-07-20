CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id UUID PRIMARY KEY REFERENCES public.community_users(id) ON DELETE CASCADE,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);