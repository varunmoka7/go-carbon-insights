-- Story 4.5.4: Delete Comments - Database Schema for Soft Deletion
-- Add soft deletion support to community_replies table

-- Add soft deletion columns to community_replies
ALTER TABLE community_replies ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE community_replies ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

-- Create indexes for soft deletion queries
CREATE INDEX IF NOT EXISTS idx_community_replies_deleted_at ON community_replies(deleted_at, topic_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_deleted_by ON community_replies(deleted_by);

-- Create view for active (non-deleted) replies
CREATE OR REPLACE VIEW active_community_replies AS
SELECT * FROM community_replies WHERE deleted_at IS NULL;

-- Update RLS policies for reply deletion
CREATE POLICY "Users can soft delete own replies" ON community_replies
  FOR UPDATE 
  USING (auth.uid() = author_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = author_id);

-- Function to update topic reply count excluding deleted replies
CREATE OR REPLACE FUNCTION update_topic_reply_count_excluding_deleted(topic_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE community_topics 
  SET reply_count = (
    SELECT COUNT(*) 
    FROM community_replies 
    WHERE topic_id = topic_uuid AND deleted_at IS NULL
  )
  WHERE id = topic_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update topic reply count when reply is deleted
CREATE OR REPLACE FUNCTION trigger_update_topic_reply_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- If reply is being soft deleted (deleted_at changed from null to non-null)
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    PERFORM update_topic_reply_count_excluding_deleted(NEW.topic_id);
  END IF;
  
  -- If reply is being restored (deleted_at changed from non-null to null)
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    PERFORM update_topic_reply_count_excluding_deleted(NEW.topic_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reply_soft_delete_count_update ON community_replies;
CREATE TRIGGER trigger_reply_soft_delete_count_update
  AFTER UPDATE ON community_replies
  FOR EACH ROW
  WHEN (OLD.deleted_at IS DISTINCT FROM NEW.deleted_at)
  EXECUTE FUNCTION trigger_update_topic_reply_count_on_delete();

-- Update existing topics to have correct reply counts (excluding any deleted replies)
UPDATE community_topics 
SET reply_count = (
  SELECT COUNT(*) 
  FROM community_replies 
  WHERE topic_id = community_topics.id AND deleted_at IS NULL
);