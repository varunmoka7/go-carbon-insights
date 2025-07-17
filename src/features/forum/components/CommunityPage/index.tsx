import React from 'react';
import Header from './Header';
import ForumLayout from '../ForumLayout';
import Sidebar from './Sidebar';
import TopicsList from './TopicsList';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100 font-sans">
      <Header />
      <ForumLayout
        sidebar={<Sidebar />}
        main={<TopicsList />}
        right={null}
      />
    </div>
  );
};

export default CommunityPage; 