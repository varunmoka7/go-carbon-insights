import React, { useState } from 'react';
import TopicItem from './TopicItem';

const sampleTopics = [
  {
    id: '1',
    title: 'SBTi validation timeline for manufacturing companies',
    category: { name: 'Regulations', color: 'bg-yellow-600' },
    replies: 4,
    views: 120,
    lastActivity: '2d',
    participants: [
      { name: 'Dr. Sarah Chen', initials: 'SC', color: 'bg-emerald-600' },
      { name: 'Mike Rodriguez', initials: 'MR', color: 'bg-blue-600' },
      { name: 'Anna Kowalski', initials: 'AK', color: 'bg-gray-600' },
    ],
  },
  {
    id: '2',
    title: 'Scope 3 calculation methodology for financial services',
    category: { name: 'Scope 1-2-3', color: 'bg-green-600' },
    replies: 7,
    views: 210,
    lastActivity: '5d',
    participants: [
      { name: 'James Liu', initials: 'JL', color: 'bg-blue-700' },
      { name: 'Dr. Sarah Chen', initials: 'SC', color: 'bg-emerald-600' },
    ],
  },
  {
    id: '3',
    title: 'GHG Protocol updates 2024 - implementation guidance',
    category: { name: 'Regulations', color: 'bg-yellow-600' },
    replies: 2,
    views: 80,
    lastActivity: '1d',
    participants: [
      { name: 'Anna Kowalski', initials: 'AK', color: 'bg-gray-600' },
      { name: 'Mike Rodriguez', initials: 'MR', color: 'bg-blue-600' },
    ],
  },
  {
    id: '4',
    title: 'Carbon accounting software integration challenges',
    category: { name: 'Software', color: 'bg-purple-600' },
    replies: 5,
    views: 150,
    lastActivity: '3d',
    participants: [
      { name: 'James Liu', initials: 'JL', color: 'bg-blue-700' },
      { name: 'Dr. Sarah Chen', initials: 'SC', color: 'bg-emerald-600' },
      { name: 'Mike Rodriguez', initials: 'MR', color: 'bg-blue-600' },
      { name: 'Anna Kowalski', initials: 'AK', color: 'bg-gray-600' },
    ],
  },
  {
    id: '5',
    title: 'Supply chain emissions data quality issues',
    category: { name: 'Supply Chain', color: 'bg-green-700' },
    replies: 3,
    views: 95,
    lastActivity: '4d',
    participants: [
      { name: 'Mike Rodriguez', initials: 'MR', color: 'bg-blue-600' },
      { name: 'Anna Kowalski', initials: 'AK', color: 'bg-gray-600' },
    ],
  },
  {
    id: '6',
    title: 'CSRD compliance preparation - practical steps',
    category: { name: 'Regulations', color: 'bg-yellow-600' },
    replies: 6,
    views: 180,
    lastActivity: '6d',
    participants: [
      { name: 'Dr. Sarah Chen', initials: 'SC', color: 'bg-emerald-600' },
      { name: 'James Liu', initials: 'JL', color: 'bg-blue-700' },
    ],
  },
];

const tabOptions = [
  { label: 'Categories', value: 'categories' },
  { label: 'Latest', value: 'latest' },
  { label: 'Top', value: 'top' },
];

const TopicsList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const handleTopicClick = (id: string) => {
    // Placeholder for routing
    alert(`Navigate to /community/topic/${id}`);
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#232323]">
        {tabOptions.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md focus:outline-none transition-colors ${activeTab === tab.value ? 'text-emerald-400 border-b-2 border-emerald-400 bg-[#232323]' : 'text-gray-400 hover:text-emerald-300'}`}
            onClick={() => setActiveTab(tab.value)}
            aria-selected={activeTab === tab.value}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Topic List */}
      <div className="divide-y divide-[#232323] bg-[#181818] rounded-lg shadow">
        {sampleTopics.map((topic) => (
          <TopicItem key={topic.id} topic={topic} onClick={handleTopicClick} />
        ))}
      </div>
    </div>
  );
};

export default TopicsList; 