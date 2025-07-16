import React from 'react';

interface CommunityRightbarProps {
  user: any;
  trendingTags?: string[];
  stats?: {
    members?: number;
    threads?: number;
    replies?: number;
  };
}

export default function CommunityRightbar({ user, trendingTags = [], stats = {} }: CommunityRightbarProps) {
  return (
    <aside className="w-64 p-4 border-l bg-white h-full flex flex-col gap-6">
      {user && (
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Your Profile</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm font-semibold">{user.display_name || user.username}</span>
            {user.is_gct_team && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs ml-2">Expert</span>}
          </div>
          <div className="text-xs text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-500">Reputation: {user.reputation || 0}</div>
        </div>
      )}
      {trendingTags.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-1">Trending Tags</h4>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs">{tag}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <h4 className="font-semibold text-sm mb-1">Community Stats</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>Members: {stats.members || 0}</li>
          <li>Threads: {stats.threads || 0}</li>
          <li>Replies: {stats.replies || 0}</li>
        </ul>
      </div>
    </aside>
  );
} 