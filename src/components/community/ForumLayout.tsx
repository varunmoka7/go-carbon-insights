import React from 'react';

interface ForumLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  rightbar: React.ReactNode;
}

const ForumLayout: React.FC<ForumLayoutProps> = ({ sidebar, main, rightbar }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-gray-200 bg-white/80 p-4 hidden lg:block">
        {sidebar}
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto p-4 lg:p-8 flex flex-col gap-4">
        {main}
      </main>
      {/* Rightbar */}
      <aside className="w-full lg:w-80 border-l border-gray-200 bg-white/80 p-4 hidden lg:block">
        {rightbar}
      </aside>
    </div>
  );
};

export default ForumLayout; 