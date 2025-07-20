import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const TYPING_DEBOUNCE_TIME = 500; // ms
const TYPING_TIMEOUT = 3000; // ms

interface TypingStatus {
  user_id: string;
  topic_id: string;
  is_typing: boolean;
  last_typed: string;
}

export function useTypingIndicator(topicId: string) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]); // List of usernames typing
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!user || !topicId) return;
    try {
      await supabase
        .from('typing_status')
        .upsert(
          { user_id: user.id, topic_id: topicId, is_typing: isTyping, last_typed: new Date().toISOString() },
          { onConflict: 'user_id,topic_id' }
        );
    } catch (err) {
      console.error('Error updating typing status:', err);
    }
  }, [user, topicId]);

  const startTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(true);
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, TYPING_TIMEOUT);
  }, [updateTypingStatus]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(false);
  }, [updateTypingStatus]);

  useEffect(() => {
    const channel = supabase
      .channel(`typing_indicator:${topicId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `topic_id=eq.${topicId}`,
        },
        async (payload) => {
          const { new: newRecord, old: oldRecord, eventType } = payload;
          const userId = newRecord?.user_id || oldRecord?.user_id;

          if (!userId || userId === user?.id) return; // Ignore current user's own typing events

          const isTyping = newRecord?.is_typing || false;
          const lastTyped = newRecord?.last_typed ? new Date(newRecord.last_typed).getTime() : 0;
          const now = new Date().getTime();

          if (isTyping && (now - lastTyped) < TYPING_TIMEOUT) {
            // Fetch username if not already known
            const { data: profile } = await supabase
              .from('community_users')
              .select('username, display_name')
              .eq('id', userId)
              .single();
            
            if (profile && !typingUsers.includes(profile.username)) {
              setTypingUsers(prev => [...prev, profile.username]);
            }
          } else {
            setTypingUsers(prev => prev.filter(u => u !== userId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      stopTyping(); // Ensure typing status is reset on unmount
    };
  }, [topicId, user, stopTyping, typingUsers]);

  return { typingUsers, startTyping, stopTyping };
}
