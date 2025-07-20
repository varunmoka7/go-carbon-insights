import React, { useState, useEffect } from 'react';
import TopicsList from './TopicsList';
import CategoryList from '../CategoryList';
import TopicThreadView from '../TopicThreadView';

interface CommunityPageProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ 
  selectedCategory: propSelectedCategory = '', 
  onCategorySelect 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(propSelectedCategory);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [view, setView] = useState<'categories' | 'topics' | 'topic'>('topics');

  // Sync internal state with prop changes
  useEffect(() => {
    setSelectedCategory(propSelectedCategory);
  }, [propSelectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategorySelect?.(categoryId);
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
          <TopicThreadView
            topicId={selectedTopic}
            onBackToTopics={() => setView('topics')}
          />
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
    <div className="min-h-full">
      {renderMainContent()}
    </div>
  );
};

export default CommunityPage; 