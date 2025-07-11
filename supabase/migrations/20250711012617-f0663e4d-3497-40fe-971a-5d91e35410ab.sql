-- Fix RLS policies for community_users to allow users to insert their own profiles
DROP POLICY IF EXISTS "Public read access to community users" ON community_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON community_users;

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

-- Update other tables to ensure proper RLS
-- Categories - public read, authenticated users can create
CREATE POLICY "Public read access to categories" 
ON community_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create categories" 
ON community_categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Topics - public read, authenticated users can create and update their own
CREATE POLICY "Public read access to topics" 
ON community_topics 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create topics" 
ON community_topics 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own topics" 
ON community_topics 
FOR UPDATE 
USING (auth.uid() = author_id);

-- Replies - public read, authenticated users can create and update their own
CREATE POLICY "Public read access to replies" 
ON community_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON community_replies 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own replies" 
ON community_replies 
FOR UPDATE 
USING (auth.uid() = author_id);