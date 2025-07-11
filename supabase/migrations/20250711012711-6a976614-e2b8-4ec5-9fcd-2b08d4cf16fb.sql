-- Fix RLS policies for community_users to allow users to insert their own profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON community_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON community_users;
DROP POLICY IF EXISTS "Public read access to community users" ON community_users;

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" 
ON community_users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON community_users 
FOR UPDATE 
USING (auth.uid() = id);

-- Allow public read access to all community users
CREATE POLICY "Public read access to community users" 
ON community_users 
FOR SELECT 
USING (true);

-- Re-enable RLS (if it was disabled)
ALTER TABLE community_users ENABLE ROW LEVEL SECURITY;

-- Add additional RLS policies for other tables (only if they don't exist)
DO $$ 
BEGIN
  -- Categories policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_categories' AND policyname = 'Authenticated users can create categories') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create categories" ON community_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;

  -- Topics policies  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_topics' AND policyname = 'Authenticated users can create topics') THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create topics" ON community_topics FOR INSERT WITH CHECK (auth.uid() = author_id)';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_topics' AND policyname = 'Authors can update their own topics') THEN
    EXECUTE 'CREATE POLICY "Authors can update their own topics" ON community_topics FOR UPDATE USING (auth.uid() = author_id)';
  END IF;

  -- Replies policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_replies' AND policyname = 'Authors can update their own replies') THEN
    EXECUTE 'CREATE POLICY "Authors can update their own replies" ON community_replies FOR UPDATE USING (auth.uid() = author_id)';
  END IF;
END $$;