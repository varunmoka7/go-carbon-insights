import React, { useState } from 'react';
import Header from './Header';
import ForumLayout from '../ForumLayout';
import Sidebar from './Sidebar';
import TopicsList from './TopicsList';
import CategoryList from '../CategoryList';

const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [view, setView] = useState<'categories' | 'topics' | 'topic'>('topics');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('topics');
  };

  const handleTopicSelect = (topicId: string) => {
    if (topicId.startsWith('category-')) {
      const categoryId = topicId.replace('category-', '');
      setSelectedCategory(categoryId);
      setView('topics');
    } else {
      setSelectedTopic(topicId);
      setView('topic');
    }
  };

  const handleNewTopic = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('topics');
  };

  const renderMainContent = () => {
    switch (view) {
      case 'categories':
        return (
          <CategoryList 
            onTopicSelect={handleTopicSelect}
            onNewTopic={handleNewTopic}
          />
        );
      case 'topic':
        return (
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Topic View (Coming Soon)
              </h2>
              <p className="text-gray-400 mb-4">
                Topic ID: {selectedTopic}
              </p>
              <button
                onClick={() => setView('topics')}
                className="text-emerald-400 hover:text-emerald-300 underline"
              >
                ← Back to Topics
              </button>
            </div>
          </div>
        );
      case 'topics':
      default:
        return (
          <TopicsList 
            selectedCategory={selectedCategory}
            onTopicSelect={handleTopicSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 font-sans">
      <Header />
      <ForumLayout
        sidebar={
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onTopicSelect={handleTopicSelect}
          />
        }
        main={renderMainContent()}
        right={null}
      />
    </div>
  );
};

export default CommunityPage; 