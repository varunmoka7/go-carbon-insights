import React, { useState } from 'react';

export default function CommunityPostComposer({ onPost, user, loading }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    await onPost({ title, content });
    setTitle('');
    setContent('');
  };
  if (!user) return null;
  return (
    <div className="bg-white border rounded-lg p-4 shadow mb-4">
      <h3 className="font-semibold mb-2">Start a New Thread</h3>
      <input
        className="w-full border rounded p-2 mb-2"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
      />
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={4}
        placeholder="What's on your mind?"
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
      />
      <button
        className="bg-emerald-600 text-white px-4 py-1 rounded hover:bg-emerald-700"
        onClick={handlePost}
        disabled={loading}
      >
        Post
      </button>
    </div>
  );
} 