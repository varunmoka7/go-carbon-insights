import React, { useState, useMemo } from 'react';
import { Reply, ThreadedReply } from '../types';
import { ThreadedReplyItem } from './ThreadedReplyItem';

interface ThreadedReplyTreeProps {
  replies: Reply[];
  maxDepth?: number;
  onReply: (parentId: string | null, content: string) => Promise<void>;
  onEdit: (replyId: string, content: string) => Promise<void>;
  onDelete: (replyId: string) => Promise<void>;
}

export const ThreadedReplyTree: React.FC<ThreadedReplyTreeProps> = ({
  replies,
  maxDepth = 8,
  onReply,
  onEdit,
  onDelete
}) => {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());

  const toggleThread = (replyId: string) => {
    setCollapsedThreads(prev => {
      const next = new Set(prev);
      if (next.has(replyId)) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }
      return next;
    });
  };

  const buildReplyTree = useMemo((): ThreadedReply[] => {
    const replyMap = new Map<string, ThreadedReply>();
    const rootReplies: ThreadedReply[] = [];

    // Sort replies by thread_path to ensure proper ordering
    const sortedReplies = [...replies].sort((a, b) => {
      if (a.thread_path && b.thread_path) {
        return a.thread_path.localeCompare(b.thread_path);
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // First pass: create reply objects
    sortedReplies.forEach(reply => {
      replyMap.set(reply.id, {
        ...reply,
        children: []
      });
    });

    // Second pass: build tree structure
    sortedReplies.forEach(reply => {
      const replyNode = replyMap.get(reply.id)!;
      
      if (reply.parent_id) {
        const parent = replyMap.get(reply.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(replyNode);
        }
      } else {
        rootReplies.push(replyNode);
      }
    });

    return rootReplies;
  }, [replies]);

  if (replies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No replies yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div className="threaded-replies space-y-4">
      {buildReplyTree.map(reply => (
        <ThreadedReplyItem
          key={reply.id}
          reply={reply}
          depth={reply.depth}
          maxDepth={maxDepth}
          isCollapsed={collapsedThreads.has(reply.id)}
          onToggleCollapse={() => toggleThread(reply.id)}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};