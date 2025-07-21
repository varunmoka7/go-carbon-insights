-- Story 4.5.5: True Comment Nesting - Database Schema for Threaded Replies
-- Add threading support to community_replies table

-- Add threading columns to community_replies
ALTER TABLE community_replies ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES community_replies(id);
ALTER TABLE community_replies ADD COLUMN IF NOT EXISTS thread_path text;
ALTER TABLE community_replies ADD COLUMN IF NOT EXISTS depth integer DEFAULT 0;

-- Create indexes for threading performance
CREATE INDEX IF NOT EXISTS idx_community_replies_parent_id ON community_replies(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_thread_path ON community_replies(thread_path);
CREATE INDEX IF NOT EXISTS idx_community_replies_topic_depth ON community_replies(topic_id, depth);

-- Function to update thread_path and depth automatically
CREATE OR REPLACE FUNCTION update_reply_thread_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    -- Top-level reply
    NEW.thread_path = NEW.id::text;
    NEW.depth = 0;
  ELSE
    -- Nested reply
    SELECT thread_path || '/' || NEW.id::text, depth + 1
    INTO NEW.thread_path, NEW.depth
    FROM community_replies
    WHERE id = NEW.parent_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update thread paths
DROP TRIGGER IF EXISTS trigger_update_reply_thread_path ON community_replies;
CREATE TRIGGER trigger_update_reply_thread_path
  BEFORE INSERT OR UPDATE ON community_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_reply_thread_path();

-- Update existing replies to have thread paths (migration for existing data)
UPDATE community_replies 
SET 
  thread_path = id::text,
  depth = 0
WHERE thread_path IS NULL;

-- Add RLS policy for threaded replies (inherit from existing reply policies)
-- Users can read threaded replies if they can read the topic
CREATE POLICY "Users can read threaded replies" ON community_replies
  FOR SELECT 
  USING (
    topic_id IN (
      SELECT id FROM community_topics 
      WHERE deleted_at IS NULL
    )
  );

-- Users can create threaded replies if they can reply to the topic
CREATE POLICY "Users can create threaded replies" ON community_replies
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    topic_id IN (
      SELECT id FROM community_topics 
      WHERE deleted_at IS NULL
    )
  );

-- Users can update their own threaded replies
CREATE POLICY "Users can update own threaded replies" ON community_replies
  FOR UPDATE 
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Users can delete their own threaded replies
CREATE POLICY "Users can delete own threaded replies" ON community_replies
  FOR DELETE 
  USING (author_id = auth.uid());