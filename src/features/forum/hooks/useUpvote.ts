import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpvote(user: any) {
  const queryClient = useQueryClient();

  // Temporarily disabled - upvote tables don't exist yet
  const upvoteTopic = useMutation({
    mutationFn: async (topicId: string) => {
      console.log('Upvote topic temporarily disabled', topicId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
    },
  });

  const upvoteReply = useMutation({
    mutationFn: async (replyId: string) => {
      console.log('Upvote reply temporarily disabled', replyId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
    },
  });

  return { upvoteTopic, upvoteReply };
}