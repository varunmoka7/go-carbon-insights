import React from 'react';
import Navigation from './Navigation';
import Categories from './Categories';
import Tags from './Tags';
import Channels from './Channels';
import DMs from './DMs';

interface SidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onTopicSelect?: (topicId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  onTopicSelect 
}) => {
  return (
    <div className="p-6 text-gray-300">
      <Navigation />
      <Categories 
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        onTopicSelect={onTopicSelect}
      />
      <Tags />
      <Channels />
      <DMs />
    </div>
  );
};

export default Sidebar; 