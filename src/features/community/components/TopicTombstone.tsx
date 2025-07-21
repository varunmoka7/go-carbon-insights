import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Trash2, 
  Calendar, 
  User, 
  MessageCircle,
  Tag
} from 'lucide-react';
import type { Topic } from '../types';

interface TopicTombstoneProps {
  topic: Topic;
}

export const TopicTombstone: React.FC<TopicTombstoneProps> = ({ topic }) => {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/community" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </Link>
        </Button>
      </div>

      {/* Tombstone Card */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader className="text-center pb-3">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            This topic has been deleted
          </h1>
          
          <p className="text-gray-500">
            The content is no longer available, but some metadata is preserved below.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Preserved Topic Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Topic Information</h3>
            
            {/* Original Title */}
            <div>
              <label className="text-sm font-medium text-gray-600">Original Title:</label>
              <p className="text-gray-900 mt-1">{topic.title}</p>
            </div>

            {/* Category */}
            {topic.category && (
              <div>
                <label className="text-sm font-medium text-gray-600">Category:</label>
                <div className="mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {topic.category.name}
                  </Badge>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Author: {topic.author?.username || 'Unknown User'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>{topic.reply_count} {topic.reply_count === 1 ? 'reply' : 'replies'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}</span>
              </div>
              
              {topic.deleted_at && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <Trash2 className="h-4 w-4" />
                  <span>Deleted {formatDistanceToNow(new Date(topic.deleted_at), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you believe this topic was deleted in error, 
                please contact the community moderators.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/community">
                  Browse Other Topics
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/community/new">
                  Start New Topic
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};