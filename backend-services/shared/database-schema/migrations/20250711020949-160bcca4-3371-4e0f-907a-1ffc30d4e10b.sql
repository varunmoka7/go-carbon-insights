-- Create function to increment topic view count
CREATE OR REPLACE FUNCTION public.increment_topic_views(topic_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  updated_topic community_topics;
BEGIN
  -- Increment view count and return updated topic
  UPDATE public.community_topics 
  SET view_count = view_count + 1
  WHERE id = topic_uuid
  RETURNING * INTO updated_topic;
  
  IF updated_topic.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Topic not found'
    );
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'topic_id', updated_topic.id,
    'view_count', updated_topic.view_count
  );
END;
$$;