import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CommunityFeed({ topics, loading, onSelectTopic, onUpvote, userUpvotes = {} }) {
  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (!topics.length) {
    return <div className="p-8 text-center text-gray-400">No topics found.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {topics.map(topic => (
        <Card
          key={topic.id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-2">
              <Link to={`/community/topics/${topic.id}`} className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {topic.title}
                </h3>
              </Link>
              <div className="flex-shrink-0 flex items-center gap-2 ml-4">
                {topic.is_pinned && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Pinned
                  </Badge>
                )}
                {topic.accepted_answer_id && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Answered
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.author?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(topic.author?.display_name || topic.author?.username || '')}
                  </AvatarFallback>
                </Avatar>
                <span>{topic.author?.display_name || topic.author?.username || 'Unknown'}</span>
              </div>
              <span>•</span>
              <span>Last activity: {topic.last_reply_at ? new Date(topic.last_reply_at).toLocaleString() : new Date(topic.created_at).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{topic.reply_count || 0} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{topic.upvote_count || 0} upvotes</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpvote(topic)}
                className={`ml-auto ${userUpvotes[topic.id] ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-blue-50'}`}
                disabled={userUpvotes[topic.id]}
                title={userUpvotes[topic.id] ? 'You have upvoted' : 'Upvote'}
              >
                ▲ Upvote
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 