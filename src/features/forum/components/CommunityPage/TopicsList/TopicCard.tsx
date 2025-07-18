import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, CheckCircle, HelpCircle } from 'lucide-react';

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    user: { name: string; username: string; initials: string; color: string };
    category: { name: string; color: string; dot: string };
    replies: number;
    views: number;
    votes: number;
    time: string;
    tags: string[];
    answered: boolean;
    preview: string;
  };
  votes: number;
  onUpvote: () => void;
  onDownvote: () => void;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, votes, onUpvote, onDownvote, onClick }) => {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg bg-[#232323] border border-[#333] shadow hover:bg-[#262626] transition cursor-pointer focus-within:ring-2 focus-within:ring-emerald-400 group"
      tabIndex={0}
      role="button"
      aria-label={`Open topic: ${topic.title}`}
      onClick={onClick}
    >
      {/* Votes */}
      <div className="flex flex-col items-center justify-center mr-2">
        <button className="text-gray-400 hover:text-emerald-400 focus:outline-none" onClick={e => { e.stopPropagation(); onUpvote(); }} aria-label="Upvote"><ThumbsUp className="w-5 h-5" /></button>
        <span className="font-bold text-lg text-white my-1">{votes}</span>
        <button className="text-gray-400 hover:text-emerald-400 focus:outline-none" onClick={e => { e.stopPropagation(); onDownvote(); }} aria-label="Downvote"><ThumbsDown className="w-5 h-5" /></button>
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${topic.category.dot} inline-block`} />
          <span className={`text-xs font-semibold ${topic.category.color}`}>{topic.category.name}</span>
          <span className="text-xs text-gray-400 ml-2">{topic.time}</span>
          {topic.answered ? (
            <span className="flex items-center gap-1 ml-3 text-emerald-400 text-xs font-semibold"><CheckCircle className="w-4 h-4" /> Answered</span>
          ) : (
            <span className="flex items-center gap-1 ml-3 text-gray-400 text-xs font-semibold"><HelpCircle className="w-4 h-4" /> Unanswered</span>
          )}
        </div>
        <div className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors truncate">
          {topic.title}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${topic.user.color} text-white`} title={topic.user.name}>@{topic.user.initials}</span>
          <span className="text-xs text-gray-300">@{topic.user.username}</span>
        </div>
        <div className="text-gray-300 text-sm line-clamp-2 mb-2">{topic.preview}</div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {topic.tags.map(tag => (
            <span key={tag} className="bg-[#181818] text-emerald-300 border border-emerald-700 rounded-full px-3 py-1 text-xs font-medium cursor-pointer hover:bg-emerald-900 hover:text-white transition">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {/* Replies & Views */}
      <div className="flex flex-col items-end min-w-[70px] gap-2 mt-2">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
          <MessageSquare className="w-4 h-4" /> {topic.replies}
        </span>
        <span className="flex items-center gap-1 text-gray-400 font-semibold text-sm">
          <Eye className="w-4 h-4" /> {topic.views}
        </span>
      </div>
    </div>
  );
};

export default TopicCard; 