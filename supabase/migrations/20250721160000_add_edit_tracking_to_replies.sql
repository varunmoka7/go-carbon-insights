-- Add edit tracking columns to community_replies table
ALTER TABLE community_replies 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_by UUID REFERENCES auth.users(id);

-- Add RLS policy to allow reply owners to update their replies
DROP POLICY IF EXISTS "Users can update own replies" ON community_replies;
CREATE POLICY "Users can update own replies" ON community_replies
  FOR UPDATE USING (auth.uid() = author_id);

-- Create index for efficient filtering and sorting by updated_at
CREATE INDEX IF NOT EXISTS idx_community_replies_updated_at 
ON community_replies(updated_at) WHERE updated_at IS NOT NULL;

-- Update the created_at default if not already set
UPDATE community_replies 
SET updated_at = created_at 
WHERE updated_at IS NULL OR updated_at = created_at;