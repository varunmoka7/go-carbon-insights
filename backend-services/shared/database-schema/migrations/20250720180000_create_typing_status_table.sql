CREATE TABLE IF NOT EXISTS public.typing_status (
  user_id UUID PRIMARY KEY REFERENCES public.community_users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT FALSE,
  last_typed TIMESTAMPTZ DEFAULT NOW()
);