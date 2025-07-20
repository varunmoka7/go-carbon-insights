ALTER TABLE public.community_topics
ADD COLUMN IF NOT EXISTS attachments JSONB;