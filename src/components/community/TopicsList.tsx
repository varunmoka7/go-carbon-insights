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

  const sortedTopics = [...topics].sort((a, b) => {
    // Pinned topics first
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    
    // Then by last reply time or creation time
    const aTime = a.last_reply_at || a.created_at;
    const bTime = b.last_reply_at || b.created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Active Discussions</h2>
        <div className="text-sm text-gray-600">
          {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedTopics.map((topic) => (
          <Card
            key={topic.id}
            className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-emerald-300"
            onClick={() => onTopicSelect(topic.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.is_pinned && (
                      <Pin className="h-4 w-4 text-emerald-600" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                      {topic.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {topic.content}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${topic.category.color}15`,
                        color: topic.category.color,
                        border: `1px solid ${topic.category.color}30`
                      }}
                    >
                      {topic.category.name}
                    </Badge>
                    {topic.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span>by</span>
                        <span className="font-medium text-gray-900">
                          {topic.author.display_name}
                        </span>
                        <ExpertBadge
                          isTeamMember={topic.author.is_gct_team}
                          size="sm"
                        />
                      </div>
                      <span>•</span>
                      <span>{formatTimeAgo(topic.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{topic.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.reply_count}</span>
                      </div>
                      {topic.last_reply_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(topic.last_reply_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {topics.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600">
              Be the first to start a conversation in this category!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopicsList;