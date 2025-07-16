import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityActions(user) {
  const queryClient = useQueryClient();

  // Post a new topic
  const postTopic = useMutation({
    mutationFn: async (topic) => {
      if (!user) throw new Error('Not authenticated');
      await supabase.from('community_topics').insert({ ...topic, author_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-topics']);
    },
  });

  // Post a reply
  const postReply = useMutation({
    mutationFn: async (reply) => {
      if (!user) throw new Error('Not authenticated');
      await supabase.from('community_replies').insert({ ...reply, author_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-topics']);
    },
  });

  // Accept an answer
  const acceptAnswer = useMutation({
    mutationFn: async ({ topicId, replyId }) => {
      if (!user) throw new Error('Not authenticated');
      // Only topic author can accept
      const { data: topic } = await supabase.from('community_topics').select('author_id').eq('id', topicId).single();
      if (!topic || topic.author_id !== user.id) throw new Error('Only the topic author can accept an answer');
      await supabase.from('community_topics').update({ accepted_answer_id: replyId }).eq('id', topicId);
      // Award reputation and badge
      await (supabase.rpc('update_reputation', { user_id: user.id, points_to_add: 15 }) as any);
      await (supabase.rpc('award_badge', { user_id: user.id, badge_name: 'Accepted Answer' }) as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-topics']);
    },
  });

  return { postTopic, postReply, acceptAnswer };
} 