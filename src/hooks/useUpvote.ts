import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useUpvote(user) {
  const queryClient = useQueryClient();

  // Upvote a topic
  const upvoteTopic = useMutation({
    mutationFn: async (topicId) => {
      if (!user) throw new Error('Not authenticated');
      // Check if already upvoted
      const { data: existing } = await (supabase.from('topic_upvotes') as any)
        .select('topic_id')
        .eq('user_id', user.id)
        .eq('topic_id', topicId);
      if (existing && existing.length > 0) {
        // Remove upvote (toggle)
        await (supabase.from('topic_upvotes') as any)
          .delete()
          .eq('user_id', user.id)
          .eq('topic_id', topicId);
        await (supabase.rpc('decrement_topic_upvotes', { topic_id: topicId }) as any);
      } else {
        // Add upvote
        await (supabase.from('topic_upvotes') as any).insert({ user_id: user.id, topic_id: topicId });
        await (supabase.rpc('increment_topic_upvotes', { topic_id: topicId }) as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-topics']);
    },
  });

  // Upvote a reply
  const upvoteReply = useMutation({
    mutationFn: async (replyId) => {
      if (!user) throw new Error('Not authenticated');
      const { data: existing } = await (supabase.from('reply_upvotes') as any)
        .select('reply_id')
        .eq('user_id', user.id)
        .eq('reply_id', replyId);
      if (existing && existing.length > 0) {
        await (supabase.from('reply_upvotes') as any)
          .delete()
          .eq('user_id', user.id)
          .eq('reply_id', replyId);
        await (supabase.rpc('decrement_reply_upvotes', { reply_id: replyId }) as any);
      } else {
        await (supabase.from('reply_upvotes') as any).insert({ user_id: user.id, reply_id: replyId });
        await (supabase.rpc('increment_reply_upvotes', { reply_id: replyId }) as any);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-topics']);
    },
  });

  return { upvoteTopic, upvoteReply };
} 