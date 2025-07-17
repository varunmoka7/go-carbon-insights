import React, { useState } from 'react';
import { User, Edit3, Star, Calendar, Building2, Mail, Shield, Check, X, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ExpertBadge from './ExpertBadge';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    display_name: string | null;
    email: string;
    bio: string | null;
    avatar_url: string | null;
    company: string | null;
    reputation: number;
    is_gct_team: boolean;
    role: string;
    joined_at: string;
    last_active: string | null;
  };
  currentUser?: {
    id: string;
    is_gct_team: boolean;
    role: string;
  } | null;
  onProfileUpdate?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  currentUser, 
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    display_name: user.display_name || '',
    bio: user.bio || '',
    company: user.company || '',
    avatar_url: user.avatar_url || ''
  });

  const isOwnProfile = currentUser?.id === user.id;
  const canModerate = currentUser?.is_gct_team || currentUser?.role === 'moderator';

  const handleAvatarUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('community-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('community-avatars')
        .getPublicUrl(fileName);

      setEditData(prev => ({
        ...prev,
        avatar_url: urlData.publicUrl
      }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_users')
        .update({
          display_name: editData.display_name,
          bio: editData.bio,
          company: editData.company,
          avatar_url: editData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      onProfileUpdate?.();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      display_name: user.display_name || '',
      bio: user.bio || '',
      company: user.company || '',
      avatar_url: user.avatar_url || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const reputation = user.reputation || 0;
  const topicsCreated = Math.floor(Math.random() * 50) + 1; // Mock metrics
  const repliesPosted = Math.floor(Math.random() * 200) + 10;

  return (
    <Card className="border border-emerald-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                  {getInitials(user.display_name || user.username)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && isEditing && (
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-1.5 cursor-pointer shadow-lg"
                >
                  <Camera className="h-3 w-3" />
                </label>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.display_name || user.username}
                </h2>
                <ExpertBadge isTeamMember={user.is_gct_team} size="md" />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>@{user.username}</span>
                {user.role !== 'member' && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user.joined_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{reputation} reputation</span>
                </div>
                {user.company && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{user.company}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bio Section */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4" />
            About
          </h3>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <Input
                  value={editData.display_name}
                  onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="How you want to appear"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself and your work in carbon accounting..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={editData.company}
                    onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your organization"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed">
              {user.bio || 'No bio provided yet.'}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact
          </h3>
          <div className="text-sm text-gray-600">
            {isOwnProfile || canModerate ? user.email : 'Email hidden for privacy'}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Community Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{topicsCreated}</div>
              <div className="text-xs text-emerald-600">Topics Created</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{repliesPosted}</div>
              <div className="text-xs text-green-600">Replies Posted</div>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {user.is_gct_team && (
              <>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Scope 3 Emissions
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Carbon Accounting
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  GHG Protocol
                </Badge>
              </>
            )}
            <Badge variant="outline">Climate Tech</Badge>
            <Badge variant="outline">Sustainability</Badge>
          </div>
        </div>

        {/* Moderation Tools (only for moderators/team) */}
        {canModerate && !isOwnProfile && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Moderation tools available</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;