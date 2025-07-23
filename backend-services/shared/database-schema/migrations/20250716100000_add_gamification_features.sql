-- Add upvote counts to topics and replies
ALTER TABLE public.community_topics
ADD COLUMN upvote_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.community_replies
ADD COLUMN upvote_count INT NOT NULL DEFAULT 0;

-- Add reputation to users
ALTER TABLE public.community_users
ADD COLUMN reputation INT NOT NULL DEFAULT 0;

-- Add accepted answer tracking to topics
-- Note: We need to add a foreign key constraint to community_replies.
-- This will be a circular reference, so we handle it carefully.
ALTER TABLE public.community_topics
ADD COLUMN accepted_answer_id UUID;

ALTER TABLE public.community_topics
ADD CONSTRAINT fk_accepted_answer
FOREIGN KEY (accepted_answer_id)
REFERENCES public.community_replies(id)
ON DELETE SET NULL;

-- Create a table to store user upvote activity to prevent duplicate votes
CREATE TABLE public.community_upvotes (
    user_id UUID NOT NULL REFERENCES public.community_users(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, reply_id),
    UNIQUE (user_id, topic_id),
    CONSTRAINT chk_vote_target CHECK (
        (reply_id IS NOT NULL AND topic_id IS NULL) OR
        (reply_id IS NULL AND topic_id IS NOT NULL)
    )
);

-- Create tables for the new gamification/badge system
CREATE TABLE public.community_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT, -- e.g., 'Award', 'Star', 'ShieldCheck' from lucide-react
    color_class TEXT, -- e.g., 'text-yellow-500', 'bg-blue-100'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.community_user_badges (
    user_id UUID NOT NULL REFERENCES public.community_users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.community_badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

-- Seed the badges table with some initial values
INSERT INTO public.community_badges (name, description, icon_name, color_class) VALUES
('First Post', 'Created your first topic in the community', 'Feather', 'text-blue-500'),
('First Reply', 'Replied to a topic for the first time', 'MessageSquare', 'text-green-500'),
('Helpful Answer', 'Your reply was marked as the accepted answer', 'CheckCircle', 'text-emerald-600'),
('Curious Mind', 'Asked a question that received 10 upvotes', 'HelpCircle', 'text-purple-500'),
('Rising Star', 'Reached 50 reputation points', 'Star', 'text-yellow-500'),
('Community Pillar', 'Reached 200 reputation points', 'Shield', 'text-red-600');

-- Add indexes for performance
CREATE INDEX idx_topics_last_reply_at ON public.community_topics(last_reply_at DESC);
CREATE INDEX idx_replies_topic_id ON public.community_replies(topic_id);
CREATE INDEX idx_user_badges_user_id ON public.community_user_badges(user_id);
