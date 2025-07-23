-- Create community-avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('community-avatars', 'community-avatars', true);

-- Create storage policies for community-avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'community-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'community-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'community-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add company and reputation columns to community_users table
ALTER TABLE community_users 
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0;