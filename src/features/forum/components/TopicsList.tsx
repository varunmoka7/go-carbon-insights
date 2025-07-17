import React, { useState, useEffect } from 'react';
import { Eye, MessageSquare, Clock, Pin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExpertBadge from './ExpertBadge';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

interface Topic {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    display_name: string;
    is_gct_team: boolean;
  };
  category: {
    name: string;
    color: string;
  };
  is_pinned: boolean;
  view_count: number;
  reply_count: number;
  tags: string[];
  created_at: string;
  last_reply_at: string | null;
  last_reply_by: {
    username: string;
    display_name: string;
    is_gct_team: boolean;
  } | null;
}

interface TopicsListProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
}

const TopicsList: React.FC<TopicsListProps> = ({ topics, onTopicSelect }) => {
  const [localTopics, setLocalTopics] = useState<Topic[]>(topics);
  const [viewedTopics, setViewedTopics] = useState<Set<string>>(new Set());

  // Update local topics when props change
  useEffect(() => {
    setLocalTopics(topics);
  }, [topics]);

  // Set up real-time subscription for topic updates
  useEffect(() => {
    const channel = supabase
      .channel('topic-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'community_topics'
        },
        (payload) => {
          setLocalTopics(prev => 
            prev.map(topic => 
              topic.id === payload.new.id 
                ? { ...topic, view_count: payload.new.view_count, reply_count: payload.new.reply_count }
                : topic
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const truncate = (str: string, n: number) => (str.length > n ? str.slice(0, n - 1) + '…' : str);
  const stripHtml = (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

  // Increment view count with session-based debouncing
  const handleTopicView = async (topicId: string) => {
    // Check if already viewed in this session
    if (viewedTopics.has(topicId)) {
      onTopicSelect(topicId);
      return;
    }

    try {
      // Call the database function to increment views
      const { data, error } = await supabase.rpc('increment_topic_views', {
        topic_uuid: topicId
      });

      if (error) {
        console.error('Error incrementing view count:', error);
      } else if (data && typeof data === 'object' && 'success' in data && data.success) {
        // Mark as viewed in this session
        setViewedTopics(prev => new Set([...prev, topicId]));
        
        // Update local state immediately
        const responseData = data as { success: boolean; view_count: number };
        setLocalTopics(prev => 
          prev.map(topic => 
            topic.id === topicId 
              ? { ...topic, view_count: responseData.view_count }
              : topic
          )
        );
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }

    // Continue with topic selection
    onTopicSelect(topicId);
  };

  // Filter for varun_moka_gct posts (knowledge base content)
  const expertTopics = localTopics.filter(topic => 
    topic.author?.username === 'varun_moka' || 
    topic.author?.username === 'varun_moka_gct'
  );

  const sortedTopics = [...expertTopics].sort((a, b) => {
    // Pinned topics first
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    // Then by last reply time or creation time
    const aTime = a.last_reply_at || a.created_at;
    const bTime = b.last_reply_at || b.created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div className="space-y-8">
      {/* Professional Header */}
      <div className="bg-white border border-emerald-200 rounded-xl p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-montserrat font-bold text-emerald-700 mb-2 tracking-tight">
            Knowledge Base Content
          </h2>
          <p className="text-gray-600 text-lg">
            Expert insights and guidance from the GoCarbonTracker team
          </p>
          <div className="mt-3 text-base text-emerald-600 font-semibold">
            {sortedTopics.length} professional {sortedTopics.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </div>
      {/* Professional Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedTopics.map((topic) => (
          <Card
            key={topic.id}
            className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-400 bg-white rounded-2xl min-h-[320px] flex flex-col justify-between"
            onClick={() => handleTopicView(topic.id)}
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex-1 flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-center gap-2 mb-2">
                  {topic.is_pinned && (
                    <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                      <Pin className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs font-semibold">
                    {topic.category.name}
                  </Badge>
                </div>
                {/* Title */}
                <h3 className="text-xl font-montserrat font-bold text-emerald-700 leading-tight group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {truncate(topic.title, 80)}
                </h3>
                {/* Content Preview */}
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-emerald-400 min-h-[48px]">
                  <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                    {truncate(stripHtml(topic.content), 120)}
                  </p>
                </div>
                {/* Tags */}
                {topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {topic.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white hover:bg-emerald-50 border-emerald-100">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {/* Footer Section */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-base">
                      {topic.author?.username?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-semibold text-gray-900 text-sm">
                        {truncate(topic.author?.display_name || topic.author?.username || 'Expert', 18)}
                      </span>
                      <ExpertBadge isTeamMember={topic.author.is_gct_team} size="sm" />
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(topic.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right font-montserrat text-emerald-600">
                  <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-semibold">{topic.view_count}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-semibold">{topic.reply_count}</span>
                  </div>
                  {topic.last_reply_at && (
                    <div className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTimeAgo(topic.last_reply_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Empty State */}
      {sortedTopics.length === 0 && (
        <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/30 rounded-xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-montserrat font-semibold text-emerald-600 mb-2 text-center">
              Knowledge Base Loading
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Professional content from carbon accounting experts will appear here
            </p>
            <div className="text-sm text-emerald-600">
              Select a category to explore expert insights
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicsList;