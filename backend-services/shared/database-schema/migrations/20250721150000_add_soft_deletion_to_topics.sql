-- Add soft deletion columns to community_topics table
ALTER TABLE community_topics 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Create index for efficient filtering of non-deleted topics
CREATE INDEX IF NOT EXISTS idx_community_topics_deleted_at 
ON community_topics(deleted_at) WHERE deleted_at IS NULL;

-- Create view for active (non-deleted) topics
CREATE OR REPLACE VIEW active_community_topics AS
SELECT * FROM community_topics WHERE deleted_at IS NULL;

-- Add RLS policy for soft deletion (users can soft delete their own topics)
DROP POLICY IF EXISTS "Users can soft delete own topics" ON community_topics;
CREATE POLICY "Users can soft delete own topics" ON community_topics
  FOR UPDATE USING (
    auth.uid() = author_id 
    AND deleted_at IS NULL  -- Prevent double deletion
  );

-- Update existing policies to exclude deleted topics from normal queries
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON community_topics;
CREATE POLICY "Topics are viewable by everyone" ON community_topics
  FOR SELECT USING (deleted_at IS NULL OR auth.uid() = author_id);

-- Allow viewing deleted topics for moderation (admins/moderators can see deleted content)
-- This will be useful for future moderation features
CREATE POLICY "Deleted topics viewable by moderators" ON community_topics
  FOR SELECT USING (
    deleted_at IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_app_meta_data->>'role' IN ('admin', 'moderator')
    )
  );