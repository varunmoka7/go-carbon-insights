-- RLS policies for the demo role

-- Allow read-only access to all tables in the public schema for the demo role
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to community_topics for demo role" ON public.community_topics FOR SELECT TO demo USING (true);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to community_replies for demo role" ON public.community_replies FOR SELECT TO demo USING (true);

ALTER TABLE public.community_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to community_users for demo role" ON public.community_users FOR SELECT TO demo USING (true);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to badges for demo role" ON public.badges FOR SELECT TO demo USING (true);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to user_badges for demo role" ON public.user_badges FOR SELECT TO demo USING (true);

ALTER TABLE public.topic_upvotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to topic_upvotes for demo role" ON public.topic_upvotes FOR SELECT TO demo USING (true);

ALTER TABLE public.reply_upvotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to reply_upvotes for demo role" ON public.reply_upvotes FOR SELECT TO demo USING (true);
