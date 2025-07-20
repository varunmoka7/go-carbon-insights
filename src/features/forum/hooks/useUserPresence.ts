import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const PRESENCE_INTERVAL = 30 * 1000; // Update presence every 30 seconds
const OFFLINE_THRESHOLD = 60 * 1000; // Consider offline after 60 seconds of inactivity

interface PresenceStatus {
  [userId: string]: boolean;
}

export function useUserPresence() {
  const { user } = useAuth();
  const [presence, setPresence] = useState<PresenceStatus>({});

  const updatePresence = useCallback(async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_presence')
        .upsert({ user_id: user.id, last_seen: new Date().toISOString() }, { onConflict: 'user_id' });
      if (error) throw error;
    } catch (err) {
      console.error('Error updating presence:', err);
    }
  }, [user]);

  const fetchPresence = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) return;
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('user_id, last_seen')
        .in('user_id', userIds);

      if (error) throw error;

      const newPresence: PresenceStatus = {};
      const now = new Date().getTime();
      data.forEach(p => {
        newPresence[p.user_id] = (now - new Date(p.last_seen).getTime()) < OFFLINE_THRESHOLD;
      });
      setPresence(prev => ({ ...prev, ...newPresence }));
    } catch (err) {
      console.error('Error fetching presence:', err);
    }
  }, []);

  useEffect(() => {
    // Initial presence update
    updatePresence();

    // Set up interval for periodic presence updates
    const interval = setInterval(updatePresence, PRESENCE_INTERVAL);
    return () => clearInterval(interval);
  }, [updatePresence]);

  // Real-time subscription for presence changes
  useEffect(() => {
    const channel = supabase
      .channel('user_presence_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_presence',
        },
        (payload) => {
          const updatedPresence = payload.new as { user_id: string; last_seen: string };
          const now = new Date().getTime();
          setPresence(prev => ({
            ...prev,
            [updatedPresence.user_id]: (now - new Date(updatedPresence.last_seen).getTime()) < OFFLINE_THRESHOLD,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { presence, fetchPresence };
}
