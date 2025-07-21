import React from 'react';
import { MessageSquareX } from 'lucide-react';
import type { ThreadedReply } from '../types';

interface ReplyTombstoneProps {
  reply: ThreadedReply;
  depth?: number;
  hasChildren?: boolean;
}

export const ReplyTombstone: React.FC<ReplyTombstoneProps> = ({
  reply,
  depth = 0,
  hasChildren = false
}) => {
  return (
    <div 
      className="reply-tombstone"
      style={{ marginLeft: `${depth * 24}px` }}
      data-depth={depth}
    >
      <div className="flex items-center space-x-2 py-3 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400">
        <MessageSquareX className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">[deleted]</span>
        {hasChildren && (
          <span className="text-xs opacity-75">• responses below</span>
        )}
      </div>
    </div>
  );
};