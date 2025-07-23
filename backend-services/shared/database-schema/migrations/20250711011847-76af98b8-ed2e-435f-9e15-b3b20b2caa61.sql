-- Clear existing mock data
DELETE FROM community_replies;
DELETE FROM community_topics;  
DELETE FROM community_categories;
DELETE FROM community_users;

-- Add new columns to support manual uploads
ALTER TABLE community_categories ADD COLUMN created_by UUID REFERENCES community_users(id);
ALTER TABLE community_topics ADD COLUMN context_file TEXT;
ALTER TABLE community_replies ADD COLUMN author_id UUID REFERENCES community_users(id);

-- Create storage bucket for community content
INSERT INTO storage.buckets (id, name, public) VALUES ('community-content', 'community-content', true);

-- Create storage policies for community content
CREATE POLICY "Authenticated users can upload community files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'community-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public read access to community files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-content');

CREATE POLICY "Users can update their own community files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'community-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own community files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'community-content' AND auth.uid()::text = (storage.foldername(name))[1]);