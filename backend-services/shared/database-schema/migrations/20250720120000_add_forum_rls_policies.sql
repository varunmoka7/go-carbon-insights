-- Enable RLS on forum tables
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_users ENABLE ROW LEVEL SECURITY;

-- Policies for community_topics
CREATE POLICY "Allow public read access to community topics" ON public.community_topics FOR SELECT USING (true);
CREATE POLICY "Allow users to insert their own topics" ON public.community_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own topics" ON public.community_topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own topics" ON public.community_topics FOR DELETE USING (auth.uid() = user_id);

-- Policies for community_replies
CREATE POLICY "Allow public read access to community replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Allow users to insert their own replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own replies" ON public.community_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own replies" ON public.community_replies FOR DELETE USING (auth.uid() = user_id);

-- Policies for community_users
CREATE POLICY "Allow public read access to community users" ON public.community_users FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON public.community_users FOR UPDATE USING (auth.uid() = id);