-- Add upvote_count and accepted_answer_id to community_topics
ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS upvote_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS accepted_answer_id uuid REFERENCES community_replies(id);

-- Add upvote_count to community_replies
ALTER TABLE public.community_replies ADD COLUMN IF NOT EXISTS upvote_count integer NOT NULL DEFAULT 0;

-- Add reputation to community_users
ALTER TABLE public.community_users ADD COLUMN IF NOT EXISTS reputation integer NOT NULL DEFAULT 0;

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id uuid REFERENCES community_users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- Create topic_upvotes table to prevent multiple upvotes per user
CREATE TABLE IF NOT EXISTS public.topic_upvotes (
  user_id uuid REFERENCES community_users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES community_topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);

-- Create reply_upvotes table to prevent multiple upvotes per user
CREATE TABLE IF NOT EXISTS public.reply_upvotes (
  user_id uuid REFERENCES community_users(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES community_replies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, reply_id)
); 