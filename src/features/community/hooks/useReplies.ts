import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Reply, ReplyUpdate, ThreadedReply } from '../types';

export const useReplies = (topicId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

  // Fetch threaded replies for the topic
  const { 
    data: replies = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['topic-replies', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_replies')
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url)
        `)
        .eq('topic_id', topicId)
        .eq('is_hidden', false)
        .order('thread_path', { ascending: true });

      if (error) throw error;
      return data as unknown as Reply[];
    },
    enabled: !!topicId
  });

  // Edit reply mutation
  const editReplyMutation = useMutation({
    mutationFn: async ({ replyId, updates }: { replyId: string; updates: ReplyUpdate }) => {
      if (!user) throw new Error('Not authenticated');
      
      const currentReply = replies.find(r => r.id === replyId);
      if (!currentReply) throw new Error('Reply not found');

      const { data, error } = await supabase
        .from('community_replies')
        .update({
          content: updates.content,
          updated_at: new Date().toISOString(),
          edit_count: (currentReply.edit_count || 0) + 1,
          last_edited_by: user.id
        })
        .eq('id', replyId)
        .eq('author_id', user.id) // Ensure ownership
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data as unknown as Reply;
    },
    onSuccess: (updatedReply) => {
      // Update the replies in cache
      queryClient.setQueryData(['topic-replies', topicId], (prev: Reply[] = []) =>
        prev.map(reply => reply.id === updatedReply.id ? updatedReply : reply)
      );
      
      // Clear editing state
      setEditingReplyId(null);
    },
    onError: (error) => {
      console.error('Failed to update reply:', error);
    }
  });

  // Create reply mutation (supports threading)
  const createReplyMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string | null }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_replies')
        .insert({
          topic_id: topicId,
          content,
          parent_id: parentId,
          author_id: user.id
        })
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data as unknown as Reply;
    },
    onSuccess: (newReply) => {
      // Add the new reply to cache
      queryClient.setQueryData(['topic-replies', topicId], (prev: Reply[] = []) => {
        const updated = [...prev, newReply].sort((a, b) => {
          if (a.thread_path && b.thread_path) {
            return a.thread_path.localeCompare(b.thread_path);
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        return updated;
      });

      // Update topic reply count
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error) => {
      console.error('Failed to create reply:', error);
    }
  });

  // Delete reply mutation (soft delete)
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_replies')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id
        })
        .eq('id', replyId)
        .eq('author_id', user.id) // Ensure ownership
        .is('deleted_at', null) // Prevent re-deletion
        .select(`
          *,
          author:community_users!author_id(id, username, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data as unknown as Reply;
    },
    onSuccess: (deletedReply) => {
      // Update the reply in cache to show as deleted
      queryClient.setQueryData(['topic-replies', topicId], (prev: Reply[] = []) =>
        prev.map(reply => 
          reply.id === deletedReply.id ? deletedReply : reply
        )
      );

      // Update topic reply count (will be handled by database trigger)
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
    },
    onError: (error) => {
      console.error('Failed to delete reply:', error);
    }
  });

  // Helper functions
  const editReply = (replyId: string, updates: ReplyUpdate) => {
    return editReplyMutation.mutateAsync({ replyId, updates });
  };

  const createReply = (content: string, parentId?: string | null) => {
    return createReplyMutation.mutateAsync({ content, parentId });
  };

  const deleteReply = (replyId: string) => {
    return deleteReplyMutation.mutateAsync(replyId);
  };

  const startEditingReply = (replyId: string) => {
    setEditingReplyId(replyId);
  };

  const cancelEditingReply = () => {
    setEditingReplyId(null);
  };

  const isEditingReply = (replyId: string) => {
    return editingReplyId === replyId;
  };

  return {
    // Data
    replies,
    
    // Loading states
    isLoading,
    
    // Errors
    error,
    
    // Reply CRUD operations
    createReply,
    editReply,
    deleteReply,
    
    // Edit functionality
    startEditingReply,
    cancelEditingReply,
    isEditingReply,
    editingReplyId,
    
    // Loading states
    isCreatingReply: createReplyMutation.isPending,
    isSavingReply: editReplyMutation.isPending,
    isDeletingReply: deleteReplyMutation.isPending,
    
    // Error states
    createError: createReplyMutation.error?.message || null,
    editError: editReplyMutation.error?.message || null,
    deleteError: deleteReplyMutation.error?.message || null
  };
};