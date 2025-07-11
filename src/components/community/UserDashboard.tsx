import React, { useState, useEffect } from 'react';
import { User, Activity, FileText, MessageSquare, Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ContentUpload from './ContentUpload';
import { supabase } from '@/integrations/supabase/client';

interface UserDashboardProps {
  user: {
    id: string;
    username: string;
    display_name: string;
    email: string;
    is_gct_team: boolean;
    avatar_url?: string;
  };
  categories: any[];
  onContentUploaded: () => void;
}

interface RecentActivity {
  id: string;
  type: 'topic' | 'reply';
  title: string;
  content: string;
  created_at: string;
  category?: { name: string };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, categories, onContentUploaded }) => {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContentUpload, setShowContentUpload] = useState(false);

  useEffect(() => {
    loadRecentActivity();
  }, [user.id]);

  const loadRecentActivity = async () => {
    try {
      // Load recent topics
      const { data: topics } = await supabase
        .from('community_topics')
        .select(`
          id,
          title,
          content,
          created_at,
          category:community_categories(name)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Load recent replies
      const { data: replies } = await supabase
        .from('community_replies')
        .select(`
          id,
          content,
          created_at,
          topic:community_topics(title)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      const activity: RecentActivity[] = [
        ...(topics?.map(topic => ({
          id: topic.id,
          type: 'topic' as const,
          title: topic.title,
          content: topic.content,
          created_at: topic.created_at,
          category: topic.category
        })) || []),
        ...(replies?.map(reply => ({
          id: reply.id,
          type: 'reply' as const,
          title: `Reply to: ${reply.topic?.title}`,
          content: reply.content,
          created_at: reply.created_at
        })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Professional Dashboard Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-center text-emerald-600 font-montserrat">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* User Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar_url} alt={user.display_name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-600 text-lg font-semibold">
                    {user.display_name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h3 className="text-lg font-montserrat font-semibold text-gray-900">
                    {user.display_name || user.username}
                  </h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.is_gct_team && (
                    <Badge className="mt-1 bg-emerald-100 text-emerald-700 text-xs">
                      GCT Expert
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full text-left"
                onClick={() => {/* TODO: Implement profile editing */}}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-montserrat font-medium text-gray-900 text-left">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button
                  onClick={() => setShowContentUpload(!showContentUpload)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-left justify-start"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Upload Section */}
      {showContentUpload && (
        <ContentUpload
          onContentUploaded={() => {
            onContentUploaded();
            loadRecentActivity();
            setShowContentUpload(false);
          }}
          categories={categories}
          user={user}
        />
      )}

      {/* Recent Activity */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600 font-montserrat">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-emerald-400 pl-4 py-2 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {activity.type === 'topic' ? (
                          <FileText className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-emerald-600" />
                        )}
                        <span className="text-xs text-emerald-600 font-medium">
                          {activity.type === 'topic' ? 'Topic' : 'Reply'}
                        </span>
                        {activity.category && (
                          <Badge variant="outline" className="text-xs">
                            {activity.category.name}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 text-left">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 text-left line-clamp-2">
                        {activity.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No recent activity</p>
              <Button
                onClick={() => setShowContentUpload(true)}
                size="sm"
                className="mt-2 bg-emerald-500 hover:bg-emerald-600"
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;