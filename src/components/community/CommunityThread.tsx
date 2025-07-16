import React, { useState } from 'react';

export default function CommunityThread({ thread, replies, user, onReply, loading }) {
  const [replyContent, setReplyContent] = useState('');
  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(replyContent);
    setReplyContent('');
  };
  if (loading) return <div className="p-8 text-center text-gray-500">Loading thread...</div>;
  if (!thread) return <div className="p-8 text-center text-gray-400">No thread selected.</div>;
  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-2">{thread.title}</h2>
      <div className="mb-4 text-gray-600">{thread.content}</div>
      <div className="mb-4 text-xs text-gray-500">By {thread.author?.display_name || thread.author?.username} • {new Date(thread.created_at).toLocaleString()}</div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Replies</h3>
        {replies && replies.length ? (
          <ul className="space-y-3">
            {replies.map(reply => (
              <li key={reply.id} className="border-b pb-2">
                <div className="text-gray-800">{reply.content}</div>
                <div className="text-xs text-gray-500 mt-1">By {reply.author?.display_name || reply.author?.username} • {new Date(reply.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No replies yet.</div>
        )}
      </div>
      {user && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder="Write a reply..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
          />
          <button
            className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700"
            onClick={handleReply}
          >
            Post Reply
          </button>
        </div>
      )}
    </div>
  );
} 