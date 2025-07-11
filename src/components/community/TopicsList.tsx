import React from 'react';
import { Eye, MessageSquare, Clock, Pin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ExpertBadge from './ExpertBadge';

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

  // Filter for varun_moka_gct posts (knowledge base content)
  const expertTopics = topics.filter(topic => 
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
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-montserrat font-semibold text-emerald-600 mb-2">
            Knowledge Base Content
          </h2>
          <p className="text-gray-600">
            Expert insights and guidance from the GoCarbonTracker team
          </p>
          <div className="mt-3 text-sm text-emerald-600">
            {sortedTopics.length} professional {sortedTopics.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </div>
      
      {/* Professional Topics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {sortedTopics.map((topic) => (
          <Card
            key={topic.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-emerald-300 hover:-translate-y-1 bg-white"
            onClick={() => onTopicSelect(topic.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {topic.is_pinned && (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                          <Pin className="h-3 w-3" />
                          Featured
                        </div>
                      )}
                      <Badge
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      >
                        {topic.category.name}
                      </Badge>
                    </div>
                    
                     {/* Title - Text-left aligned, emerald-600 */}
                    <h3 className="text-lg font-montserrat font-semibold text-emerald-600 text-left leading-relaxed group-hover:text-emerald-700 transition-colors">
                      {topic.title}
                    </h3>
                  </div>
                </div>
                
                 {/* Content Preview - Left aligned */}
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-400">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 text-left">
                    {topic.content}
                  </p>
                </div>
                
                {/* Tags */}
                {topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white hover:bg-emerald-50">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Footer Section */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-xs">
                          {topic.author?.username?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-montserrat font-medium text-gray-900 text-sm">
                            {topic.author?.display_name || topic.author?.username || 'Expert'}
                          </span>
                          <ExpertBadge
                            isTeamMember={topic.author.is_gct_team}
                            size="sm"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeAgo(topic.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{topic.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">{topic.reply_count}</span>
                    </div>
                    {topic.last_reply_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{formatTimeAgo(topic.last_reply_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty State */}
      {sortedTopics.length === 0 && (
        <Card className="border-dashed border-2 border-emerald-200 bg-emerald-50/30">
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