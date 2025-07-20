import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  awardedAt: string;
}

interface BadgeSystemResponse {
  badges: Badge[];
  recentlyAwarded?: Badge[];
}

export function useBadgeSystem() {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's current badges
  const fetchUserBadges = useCallback(async () => {
    if (!user) {
      setUserBadges([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/forum/badges/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user badges');
      }

      const data: BadgeSystemResponse = await response.json();
      setUserBadges(data.badges || []);
    } catch (err) {
      console.error('Error fetching user badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to load badges');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Award the Basic badge (for completing onboarding)
  const awardBasicBadge = useCallback(async (): Promise<Badge | null> => {
    if (!user) return null;

    try {
      const response = await fetch('/api/forum/badges/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          badgeType: 'basic',
          action: 'onboarding_complete'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          // Badge already awarded, not an error
          return null;
        }
        throw new Error(errorData.error || 'Failed to award basic badge');
      }

      const newBadge: Badge = await response.json();
      
      // Update local state
      setUserBadges(prev => [...prev, newBadge]);
      
      return newBadge;
    } catch (err) {
      console.error('Error awarding basic badge:', err);
      return null;
    }
  }, [user]);

  // Award the First Like badge
  const awardFirstLikeBadge = useCallback(async (): Promise<Badge | null> => {
    if (!user) return null;

    try {
      const response = await fetch('/api/forum/badges/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          badgeType: 'first_like',
          action: 'first_upvote'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          // Badge already awarded, not an error
          return null;
        }
        throw new Error(errorData.error || 'Failed to award first like badge');
      }

      const newBadge: Badge = await response.json();
      
      // Update local state
      setUserBadges(prev => [...prev, newBadge]);
      
      return newBadge;
    } catch (err) {
      console.error('Error awarding first like badge:', err);
      return null;
    }
  }, [user]);

  // Check if user has a specific badge
  const hasBadge = useCallback((badgeName: string): boolean => {
    return userBadges.some(badge => badge.name === badgeName);
  }, [userBadges]);

  // Get badge statistics
  const getBadgeStats = useCallback(() => {
    const totalBadges = userBadges.length;
    const badgesByCategory = userBadges.reduce((acc, badge) => {
      acc[badge.category] = (acc[badge.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentBadges = userBadges
      .sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime())
      .slice(0, 3);

    return {
      totalBadges,
      badgesByCategory,
      recentBadges
    };
  }, [userBadges]);

  // Fetch badges on component mount and user change
  useEffect(() => {
    fetchUserBadges();
  }, [fetchUserBadges]);

  return {
    userBadges,
    isLoading,
    error,
    fetchUserBadges,
    awardBasicBadge,
    awardFirstLikeBadge,
    hasBadge,
    getBadgeStats,
  };
}