import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="space-y-2">
      <div className="text-gray-100 font-semibold text-sm py-2">Topics</div>
      <div className="text-gray-400 text-sm py-2">My posts</div>
      <div className="text-gray-400 text-sm py-2">My messages</div>
      <div className="text-gray-400 text-sm py-2">More</div>
    </nav>
  );
};

export default Navigation; 