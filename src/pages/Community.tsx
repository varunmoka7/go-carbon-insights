import React, { useState } from 'react';
import CommunityLayout from '@/components/CommunityLayout';
import CommunityPage from '@/features/forum/components/CommunityPage';
import Sidebar from '@/features/forum/components/CommunityPage/Sidebar';
import { WebSocketProvider } from '@/features/forum/contexts/WebSocketContext';

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <WebSocketProvider>
      <CommunityLayout
        sidebar={
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onTopicSelect={() => {}} // Placeholder for sidebar compatibility
          />
        }
      >
        <CommunityPage 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </CommunityLayout>
    </WebSocketProvider>
  );
};

export default Community;