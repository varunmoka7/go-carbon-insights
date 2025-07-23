-- Function to update user reputation on topic creation
CREATE OR REPLACE FUNCTION update_reputation_on_topic_create()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_users
  SET reputation = reputation + 5
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for topic creation
DROP TRIGGER IF EXISTS trg_update_reputation_on_topic_create ON public.community_topics;
CREATE TRIGGER trg_update_reputation_on_topic_create
AFTER INSERT ON public.community_topics
FOR EACH ROW EXECUTE FUNCTION update_reputation_on_topic_create();

-- Function to update user reputation on reply creation
CREATE OR REPLACE FUNCTION update_reputation_on_reply_create()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.community_users
  SET reputation = reputation + 2
  WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reply creation
DROP TRIGGER IF EXISTS trg_update_reputation_on_reply_create ON public.community_replies;
CREATE TRIGGER trg_update_reputation_on_reply_create
AFTER INSERT ON public.community_replies
FOR EACH ROW EXECUTE FUNCTION update_reputation_on_reply_create();

-- Function to update user reputation on topic upvote/downvote
CREATE OR REPLACE FUNCTION update_reputation_on_topic_upvote()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_users
    SET reputation = reputation + 10
    WHERE id = (SELECT author_id FROM public.community_topics WHERE id = NEW.topic_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_users
    SET reputation = reputation - 10
    WHERE id = (SELECT author_id FROM public.community_topics WHERE id = OLD.topic_id);
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for topic upvotes
DROP TRIGGER IF EXISTS trg_update_reputation_on_topic_upvote ON public.topic_upvotes;
CREATE TRIGGER trg_update_reputation_on_topic_upvote
AFTER INSERT OR DELETE ON public.topic_upvotes
FOR EACH ROW EXECUTE FUNCTION update_reputation_on_topic_upvote();

-- Function to update user reputation on reply upvote/downvote
CREATE OR REPLACE FUNCTION update_reputation_on_reply_upvote()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_users
    SET reputation = reputation + 5
    WHERE id = (SELECT author_id FROM public.community_replies WHERE id = NEW.reply_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_users
    SET reputation = reputation - 5
    WHERE id = (SELECT author_id FROM public.community_replies WHERE id = OLD.reply_id);
  END IF;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reply upvotes
DROP TRIGGER IF EXISTS trg_update_reputation_on_reply_upvote ON public.reply_upvotes;
CREATE TRIGGER trg_update_reputation_on_reply_upvote
AFTER INSERT OR DELETE ON public.reply_upvotes
FOR EACH ROW EXECUTE FUNCTION update_reputation_on_reply_upvote();