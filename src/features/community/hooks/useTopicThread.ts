import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Topic, TopicUpdate } from '../types';

export const useTopicThread = (topicId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch topic with author and category information
  const { 
    data: topic, 
    isLoading: topicLoading, 
    error: topicError 
  } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_topics')
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url),
          category:community_categories(id, name, slug)
        `)
        .eq('id', topicId)
        .eq('is_hidden', false)
        .single();

      if (error) throw error;
      return data as Topic;
    },
    enabled: !!topicId
  });

  // Note: Replies are now handled by useReplies hook

  // Update topic view count
  useEffect(() => {
    if (topic && user) {
      const updateViewCount = async () => {
        await supabase.rpc('increment_topic_views', { topic_id: topicId });
      };
      updateViewCount();
    }
  }, [topic, user, topicId]);

  // Edit topic mutation
  const editTopicMutation = useMutation({
    mutationFn: async (updates: TopicUpdate) => {
      if (!user || !topic) throw new Error('Not authorized');
      
      const { data, error } = await supabase
        .from('community_topics')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          edit_count: (topic.edit_count || 0) + 1,
          last_edited_by: user.id
        })
        .eq('id', topicId)
        .eq('author_id', user.id) // Ensure ownership
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url),
          category:community_categories(id, name, slug)
        `)
        .single();

      if (error) throw error;
      return data as Topic;
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData(['topic', topicId], updatedTopic);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to update topic:', error);
    }
  });

  // Delete topic mutation (soft delete)
  const deleteTopicMutation = useMutation({
    mutationFn: async (reason?: string) => {
      if (!user || !topic) throw new Error('Not authorized');
      
      const { data, error } = await supabase
        .from('community_topics')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          deletion_reason: reason || null
        })
        .eq('id', topicId)
        .eq('author_id', user.id) // Ensure ownership
        .is('deleted_at', null) // Prevent double deletion
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (deletedTopic) => {
      // Update the topic in cache to show it's deleted
      queryClient.setQueryData(['topic', topicId], (prev: Topic | undefined) => 
        prev ? { 
          ...prev, 
          deleted_at: deletedTopic.deleted_at,
          deleted_by: deletedTopic.deleted_by,
          deletion_reason: deletedTopic.deletion_reason
        } : undefined
      );
      
      // Remove from topics list cache
      queryClient.setQueryData(['topics'], (prev: Topic[] | undefined) => 
        prev ? prev.filter(t => t.id !== topicId) : []
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: (error) => {
      console.error('Failed to delete topic:', error);
    }
  });

  // Helper functions
  const canEdit = user?.id === topic?.author_id && !topic?.deleted_at;
  const canDelete = user?.id === topic?.author_id && !topic?.deleted_at;
  
  const editTopic = (updates: TopicUpdate) => {
    return editTopicMutation.mutateAsync(updates);
  };

  const deleteTopic = (reason?: string) => {
    return deleteTopicMutation.mutateAsync(reason);
  };

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => setIsEditing(false);

  return {
    // Data
    topic,
    
    // Loading states
    isLoading: topicLoading,
    topicLoading,
    
    // Errors
    error: topicError,
    topicError,
    
    // Edit functionality
    canEdit,
    isEditing,
    editTopic,
    startEditing,
    cancelEditing,
    editError: editTopicMutation.error?.message || null,
    isSaving: editTopicMutation.isPending,
    
    // Delete functionality
    canDelete,
    deleteTopic,
    deleteError: deleteTopicMutation.error?.message || null,
    isDeleting: deleteTopicMutation.isPending
  };
};