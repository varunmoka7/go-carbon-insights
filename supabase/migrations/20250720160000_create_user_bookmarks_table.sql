CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  user_id UUID REFERENCES public.community_users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, topic_id)
);