import React, { useState, useEffect } from 'react';
import { User, Edit3, Star, Calendar, Building2, Mail, Shield, Check, X, Camera, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import ExpertBadge from './ExpertBadge';
import { useAuth } from '@/contexts/AuthContext';

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  awardedAt: string;
}

interface BadgeStats {
  totalBadges: number;
  badgesByCategory: Record<string, number>;
  recentBadges: UserBadge[];
}

interface ReputationBreakdown {
  totalReputation: number;
  breakdown: {
    topics: number;
    replies: number;
    upvotes: number;
  };
}

interface UserProfileData {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    email?: string;
    bio: string | null;
    avatarUrl: string | null;
    role: string;
    reputation: number;
    isGctTeam: boolean;
    memberSince: string;
  };
  badges: UserBadge[];
  badgeStats: BadgeStats;
  reputationBreakdown: ReputationBreakdown;
}

interface UserProfileProps {
  userId?: string;
  onProfileUpdate?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onProfileUpdate 
}) => {
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: ''
  });

  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || currentUser?.id === targetUserId;
  const canModerate = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  useEffect(() => {
    if (targetUserId) {
      fetchUserProfile();
    }
  }, [targetUserId]);

  const fetchUserProfile = async () => {
    if (!targetUserId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = isOwnProfile 
        ? '/api/forum/users/profile'
        : `/api/forum/users/profile/${targetUserId}`;
        
      const response = await fetch(endpoint, {
        headers: currentUser ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfileData(data);
      
      setEditData({
        displayName: data.user.displayName || '',
        bio: data.user.bio || '',
        avatarUrl: data.user.avatarUrl || ''
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!isOwnProfile || !currentUser) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/forum/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchUserProfile();
      setIsEditing(false);
      onProfileUpdate?.();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'star': return <Star className="w-4 h-4" />;
      case 'trophy': return <Trophy className="w-4 h-4" />;
      case 'target': return <Target className="w-4 h-4" />;
      case 'shield': return <Shield className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'reputation': return 'bg-yellow-600 text-yellow-100';
      case 'participation': return 'bg-blue-600 text-blue-100';
      case 'contribution': return 'bg-green-600 text-green-100';
      case 'special': return 'bg-purple-600 text-purple-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-48"></div>
                  <div className="h-3 bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <Card className="bg-red-900/20 border-red-700">
        <CardContent className="p-6">
          <p className="text-red-400">{error || 'Profile not found'}</p>
        </CardContent>
      </Card>
    );
  }

  const { user: profileUser, badges, badgeStats, reputationBreakdown } = profileData;

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileUser.avatarUrl || undefined} />
                    <AvatarFallback className="bg-gray-600 text-gray-100 text-lg">
                      {getInitials(profileUser.displayName || profileUser.username)}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && isEditing && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0 bg-gray-700 border-gray-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {isEditing ? (
                    <Input
                      value={editData.displayName}
                      onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="text-xl font-bold bg-gray-700 border-gray-600 text-gray-100"
                      placeholder="Display name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-100">
                      {profileUser.displayName || profileUser.username}
                    </h1>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      @{profileUser.username}
                    </Badge>
                    
                    {profileUser.isGctTeam && (
                      <ExpertBadge 
                        isTeamMember={true}
                        size="sm"
                      />
                    )}
                    
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{profileUser.reputation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(profileUser.memberSince)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isOwnProfile && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-gray-200"
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSaving}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Bio */}
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">About</h3>
              {isEditing ? (
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  rows={3}
                />
              ) : (
                <p className="text-gray-300">
                  {profileUser.bio || 'No bio provided yet.'}
                </p>
              )}
            </div>

            {/* Recent Badges */}
            {badgeStats.recentBadges.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-200 mb-3">Recent Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {badgeStats.recentBadges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <Badge 
                          className={`${getBadgeColor(badge.category)} flex items-center space-x-1`}
                        >
                          {getBadgeIcon(badge.icon)}
                          <span>{badge.name}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{badge.name}</p>
                          <p className="text-sm">{badge.description}</p>
                          <p className="text-xs text-gray-400">
                            Earned {formatDate(badge.awardedAt)}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reputation Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Reputation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-yellow-400">
                  {reputationBreakdown.totalReputation}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Topics</span>
                    <span className="text-gray-300">{reputationBreakdown.breakdown.topics}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Replies</span>
                    <span className="text-gray-300">{reputationBreakdown.breakdown.replies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Upvotes</span>
                    <span className="text-gray-300">{reputationBreakdown.breakdown.upvotes}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-blue-400" />
                <span>Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-blue-400">
                  {badgeStats.totalBadges}
                </div>
                
                <div className="space-y-2">
                  {Object.entries(badgeStats.badgesByCategory).map(([category, count]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{category}</span>
                      <span className="text-gray-300">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="w-5 h-5 text-green-400" />
                <span>Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  Role: <span className="text-gray-300 capitalize">{profileUser.role}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Member since: <span className="text-gray-300">{formatDate(profileUser.memberSince)}</span>
                </div>
                {profileUser.isGctTeam && (
                  <Badge className="bg-emerald-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Team Member
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Badges */}
        {badges.length > 3 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">All Badges ({badges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {badges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className={`p-3 rounded-lg ${getBadgeColor(badge.category)} cursor-pointer hover:opacity-80 transition-opacity`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {getBadgeIcon(badge.icon)}
                          <span className="font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-xs opacity-80">
                          {formatDate(badge.awardedAt)}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-sm">{badge.description}</p>
                        <p className="text-xs text-gray-400">
                          Earned {formatDate(badge.awardedAt)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default UserProfile;