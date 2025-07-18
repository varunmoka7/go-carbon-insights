import React, { useState } from 'react';
import { Pin } from 'lucide-react';
import TopicCard from './TopicCard';

const sampleTopics = [
  {
    id: 'pinned-1',
    title: 'Welcome to the GoCarbonTracker Community!',
    category: { name: 'General', color: 'text-blue-400', dot: 'bg-blue-400' },
    replies: 12,
    views: 320,
    votes: 42,
    user: { name: 'Admin', username: 'admin', initials: 'AD', color: 'bg-emerald-600' },
    time: '1d ago',
    tags: ['community', 'welcome'],
    answered: true,
    preview: 'Introduce yourself and connect with other sustainability professionals...',
    pinned: true,
  },
  {
    id: '1',
    title: 'SBTi validation timeline for manufacturing companies',
    category: { name: 'Regulations', color: 'text-yellow-400', dot: 'bg-yellow-400' },
    replies: 4,
    views: 120,
    votes: 15,
    user: { name: 'Dr. Sarah Chen', username: 'sarahchen', initials: 'SC', color: 'bg-emerald-600' },
    time: '2d ago',
    tags: ['SBTi', 'manufacturing'],
    answered: false,
    preview: 'What is the typical timeline and process for SBTi validation in the manufacturing sector?...',
    pinned: false,
  },
  {
    id: '2',
    title: 'Scope 3 calculation methodology for financial services',
    category: { name: 'Scope 1-2-3', color: 'text-green-400', dot: 'bg-green-400' },
    replies: 7,
    views: 210,
    votes: 22,
    user: { name: 'Mike Rodriguez', username: 'miker', initials: 'MR', color: 'bg-blue-600' },
    time: '5d ago',
    tags: ['scope3', 'finance'],
    answered: true,
    preview: 'How are financial institutions approaching Scope 3 calculations for investments and loans?...',
    pinned: false,
  },
  {
    id: '3',
    title: 'GHG Protocol updates 2024 - implementation guidance',
    category: { name: 'Regulations', color: 'text-yellow-400', dot: 'bg-yellow-400' },
    replies: 2,
    views: 80,
    votes: 8,
    user: { name: 'Anna Kowalski', username: 'annak', initials: 'AK', color: 'bg-gray-600' },
    time: '1d ago',
    tags: ['GHG Protocol', 'updates'],
    answered: false,
    preview: 'The 2024 GHG Protocol update brings new requirements for data quality and reporting...',
    pinned: false,
  },
  {
    id: '4',
    title: 'Carbon accounting software integration challenges',
    category: { name: 'Software', color: 'text-purple-400', dot: 'bg-purple-400' },
    replies: 5,
    views: 150,
    votes: 10,
    user: { name: 'James Liu', username: 'jamesl', initials: 'JL', color: 'bg-blue-700' },
    time: '3d ago',
    tags: ['software', 'integration'],
    answered: true,
    preview: 'What are the main hurdles when integrating carbon accounting tools with ERP systems?...',
    pinned: false,
  },
];

const sortOptions = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '🆕 New', value: 'new' },
  { label: '📊 Top', value: 'top' },
  { label: '💬 Active', value: 'active' },
];

const TopicsList: React.FC = () => {
  const [sort, setSort] = useState('hot');
  const [votes, setVotes] = useState(() => Object.fromEntries(sampleTopics.map(t => [t.id, t.votes])));
  const handleNewTopic = () => alert('Open new topic form');
  const handleTopicClick = (id: string) => alert(`Navigate to /community/topic/${id}`);
  const handleVote = (id: string, delta: number) => setVotes(v => ({ ...v, [id]: v[id] + delta }));

  const pinned = sampleTopics.filter(t => t.pinned);
  const regular = sampleTopics.filter(t => !t.pinned);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header and New Topic Button */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Community Discussions</h2>
        <button
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onClick={handleNewTopic}
        >
          [+ New Topic]
        </button>
      </div>
      {/* Sort Options */}
      <div className="flex items-center gap-2 mb-4">
        {sortOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${sort === opt.value ? 'bg-emerald-700 text-white' : 'bg-[#232323] text-gray-400 hover:bg-emerald-900 hover:text-white'}`}
            onClick={() => setSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
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
                votes={votes[topic.id]}
                onUpvote={() => handleVote(topic.id, 1)}
                onDownvote={() => handleVote(topic.id, -1)}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      )}
      {/* Regular Topics */}
      <div className="space-y-3">
        {regular.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            votes={votes[topic.id]}
            onUpvote={() => handleVote(topic.id, 1)}
            onDownvote={() => handleVote(topic.id, -1)}
            onClick={() => handleTopicClick(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicsList; 