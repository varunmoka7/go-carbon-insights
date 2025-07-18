import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityActions(user: any) {
  const queryClient = useQueryClient();

  // Post a new topic
  const postTopic = useMutation({
    mutationFn: async (topic: any) => {
      if (!user) throw new Error('Not authenticated');
      await supabase.from('community_topics').insert({ ...topic, author_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
    },
  });

  // Post a reply
  const postReply = useMutation({
    mutationFn: async (reply: any) => {
      if (!user) throw new Error('Not authenticated');
      await supabase.from('community_replies').insert({ ...reply, author_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
    },
  });

  // Accept an answer - temporarily disabled
  const acceptAnswer = useMutation({
    mutationFn: async (params: { topicId: string; replyId: string }) => {
      console.log('Accept answer temporarily disabled', params);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
    },
  });

  return { postTopic, postReply, acceptAnswer };
}