import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TopicsList, TopicThreadView } from '@/features/community/components';

const Community = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Community Forum
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with carbon tracking professionals, share insights, and learn from industry experts.
          </p>
        </div>

        {/* Content */}
        <Routes>
          <Route path="/" element={<TopicsList />} />
          <Route path="/topic/:topicId" element={<TopicThreadRoute />} />
        </Routes>
      </div>
    </div>
  );
};

// Component to handle topic thread route
const TopicThreadRoute: React.FC = () => {
  const location = useLocation();
  const topicId = location.pathname.split('/').pop();
  
  if (!topicId) {
    return <div>Topic not found</div>;
  }
  
  return <TopicThreadView topicId={topicId} />;
};

export default Community;