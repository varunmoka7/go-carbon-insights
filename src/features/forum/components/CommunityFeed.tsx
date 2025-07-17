import React from 'react';

export default function CommunityFeed({ topics, loading, onSelectTopic, onUpvote, userUpvotes = {} }) {
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading topics...</div>;
  }
  if (!topics.length) {
    return <div className="p-8 text-center text-gray-400">No topics found.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {topics.map(topic => (
        <div
          key={topic.id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-emerald-700 cursor-pointer" onClick={() => onSelectTopic(topic)}>{topic.title}</span>
            {topic.is_pinned && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Pinned</span>}
            {topic.accepted_answer_id && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Answered</span>}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>By {topic.author?.display_name || topic.author?.username}</span>
            <span>Replies: {topic.reply_count || 0}</span>
            <span>Upvotes: {topic.upvote_count || 0}</span>
            <button
              className={`ml-2 px-2 py-0.5 rounded text-xs border ${userUpvotes[topic.id] ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'}`}
              onClick={() => onUpvote(topic)}
              disabled={userUpvotes[topic.id]}
              title={userUpvotes[topic.id] ? 'You have upvoted' : 'Upvote'}
            >
              ▲ Upvote
            </button>
            <span>Last activity: {topic.last_reply_at ? new Date(topic.last_reply_at).toLocaleString() : new Date(topic.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 