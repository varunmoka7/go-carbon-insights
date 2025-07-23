-- Add edit tracking columns to community_topics table
ALTER TABLE community_topics 
ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id);

-- Add RLS policy to allow topic owners to update their topics
DROP POLICY IF EXISTS "Users can update own topics" ON community_topics;
CREATE POLICY "Users can update own topics" ON community_topics
  FOR UPDATE USING (auth.uid() = author_id);

-- Create function to increment topic view count
CREATE OR REPLACE FUNCTION increment_topic_views(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE community_topics 
  SET view_count = view_count + 1
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_topic_views(UUID) TO authenticated;