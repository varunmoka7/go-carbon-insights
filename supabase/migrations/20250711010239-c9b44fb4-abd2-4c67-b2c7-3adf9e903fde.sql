-- Create community platform database schema
-- Users table for community (separate from main app)
CREATE TABLE public.community_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  is_gct_team BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  bio TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Categories table for forum organization
CREATE TABLE public.community_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#059669',
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Topics table for forum discussions
CREATE TABLE public.community_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category_id UUID NOT NULL REFERENCES public.community_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.community_users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  last_reply_by UUID REFERENCES public.community_users(id),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Replies table for topic responses
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.community_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.community_users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.community_replies(id),
  is_expert_answer BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_community_topics_category_id ON public.community_topics(category_id);
CREATE INDEX idx_community_topics_author_id ON public.community_topics(author_id);
CREATE INDEX idx_community_topics_created_at ON public.community_topics(created_at DESC);
CREATE INDEX idx_community_replies_topic_id ON public.community_replies(topic_id);
CREATE INDEX idx_community_replies_author_id ON public.community_replies(author_id);
CREATE INDEX idx_community_replies_created_at ON public.community_replies(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.community_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_users
CREATE POLICY "Public read access to community users" 
ON public.community_users FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.community_users FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for community_categories
CREATE POLICY "Public read access to categories" 
ON public.community_categories FOR SELECT 
USING (is_active = true);

-- RLS Policies for community_topics
CREATE POLICY "Public read access to topics" 
ON public.community_topics FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create topics" 
ON public.community_topics FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Topic authors can update their topics" 
ON public.community_topics FOR UPDATE 
USING (auth.uid() = author_id);

-- RLS Policies for community_replies
CREATE POLICY "Public read access to replies" 
ON public.community_replies FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.community_replies FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Reply authors can update their replies" 
ON public.community_replies FOR UPDATE 
USING (auth.uid() = author_id);

-- Function to update reply count
CREATE OR REPLACE FUNCTION update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_topics 
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at,
        last_reply_by = NEW.author_id
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_topics 
    SET reply_count = reply_count - 1
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reply count
CREATE TRIGGER update_topic_reply_count_trigger
AFTER INSERT OR DELETE ON public.community_replies
FOR EACH ROW EXECUTE FUNCTION update_topic_reply_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_community_users_updated_at
BEFORE UPDATE ON public.community_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_categories_updated_at
BEFORE UPDATE ON public.community_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_topics_updated_at
BEFORE UPDATE ON public.community_topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_replies_updated_at
BEFORE UPDATE ON public.community_replies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();