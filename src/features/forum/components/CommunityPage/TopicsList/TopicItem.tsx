import React from 'react';
import CategoryBadge from './CategoryBadge';
import UserAvatars from './UserAvatars';
import { MessageSquare } from 'lucide-react';

interface TopicItemProps {
  topic: {
    id: string;
    title: string;
    category: { name: string; color: string };
    replies: number;
    views: number;
    lastActivity: string;
    participants: { name: string; initials: string; color: string }[];
  };
  onClick: (id: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ topic, onClick }) => {
  return (
    <div
      className="flex items-center justify-between py-4 px-2 border-b border-[#232323] hover:bg-[#232323] transition cursor-pointer group"
      onClick={() => onClick(topic.id)}
      tabIndex={0}
      role="button"
      aria-label={`Open topic: ${topic.title}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge name={topic.category.name} color={topic.category.color} />
        </div>
        <div className="text-lg font-medium text-white truncate group-hover:text-emerald-400">
          {topic.title}
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <UserAvatars participants={topic.participants} />
        <div className="flex flex-col items-end min-w-[80px]">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <MessageSquare className="w-4 h-4" />
            <span>{topic.replies}</span>
            <span className="ml-2">{topic.views} views</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{topic.lastActivity}</div>
        </div>
      </div>
    </div>
  );
};

export default TopicItem; 