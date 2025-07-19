import React, { useState } from 'react';
import { Pin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TopicCard from './TopicCard';
import NewTopicForm from '../../NewTopicForm';
import { useCommunityTopics } from '../../../hooks/useCommunityTopics';
import { useCommunityCategories } from '../../../hooks/useCommunityCategories';
import { useAuth } from '@/contexts/AuthContext';

interface TopicsListProps {
  selectedCategory?: string;
  onTopicSelect?: (topicId: string) => void;
}

const sortOptions = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '🆕 New', value: 'new' },
  { label: '📊 Top', value: 'top' },
  { label: '💬 Active', value: 'active' },
];

const TopicsList: React.FC<TopicsListProps> = ({ selectedCategory, onTopicSelect }) => {
  const [sort, setSort] = useState('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  
  const { user } = useAuth();
  const { categories } = useCommunityCategories();
  const { topics, loading, error } = useCommunityTopics(selectedCategory, searchQuery);

  const handleNewTopic = () => {
    setShowNewTopicForm(true);
  };

  const handleTopicClick = (id: string) => {
    onTopicSelect?.(id);
  };

  const handleNewTopicSuccess = (topicId: string) => {
    handleTopicClick(topicId);
  };

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.name 
    : null;

  const sortedTopics = React.useMemo(() => {
    const sorted = [...topics];
    switch (sort) {
      case 'new':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'top':
        return sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      case 'active':
        return sorted.sort((a, b) => {
          const aTime = a.last_reply_at || a.created_at;
          const bTime = b.last_reply_at || b.created_at;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      case 'hot':
      default:
        return sorted.sort((a, b) => {
          const aScore = (a.reply_count || 0) * 2 + (a.view_count || 0) * 0.1;
          const bScore = (b.reply_count || 0) * 2 + (b.view_count || 0) * 0.1;
          return bScore - aScore;
        });
    }
  }, [topics, sort]);

  const pinned = sortedTopics.filter(t => t.is_pinned);
  const regular = sortedTopics.filter(t => !t.is_pinned);

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 mt-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {selectedCategoryName ? `${selectedCategoryName} Discussions` : 'Community Discussions'}
          </h2>
          <button
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={handleNewTopic}
          >
            [+ New Topic]
          </button>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg p-4">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Error loading topics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header and New Topic Button */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {selectedCategoryName ? `${selectedCategoryName} Discussions` : 'Community Discussions'}
        </h2>
        <button
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNewTopic}
          disabled={!user}
          title={!user ? 'Login required to create topics' : 'Create a new topic'}
        >
          [+ New Topic]
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4">
        {sortOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              sort === opt.value 
                ? 'bg-emerald-700 text-white' 
                : 'bg-[#232323] text-gray-400 hover:bg-emerald-900 hover:text-white'
            }`}
            onClick={() => setSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* No Topics Message */}
      {topics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">
            {searchQuery 
              ? `No topics found matching "${searchQuery}"` 
              : selectedCategoryName 
                ? `No topics in ${selectedCategoryName} yet` 
                : 'No topics yet'
            }
          </p>
          {user && (
            <button
              onClick={handleNewTopic}
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              Be the first to start a discussion!
            </button>
          )}
        </div>
      )}

      {/* Pinned Topics */}
      {pinned.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
            <Pin className="w-4 h-4" /> Pinned
          </div>
          <div className="space-y-3">
            {pinned.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Topics */}
      {regular.length > 0 && (
        <div className="space-y-3">
          {regular.map(topic => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => handleTopicClick(topic.id)}
            />
          ))}
        </div>
      )}

      {/* New Topic Form Modal */}
      <NewTopicForm
        isOpen={showNewTopicForm}
        onClose={() => setShowNewTopicForm(false)}
        initialCategoryId={selectedCategory}
        onSuccess={handleNewTopicSuccess}
      />
    </div>
  );
};

export default TopicsList; 