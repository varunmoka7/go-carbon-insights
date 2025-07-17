import React from 'react';

interface ForumLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  right?: React.ReactNode;
}

const ForumLayout: React.FC<ForumLayoutProps> = ({ sidebar, main, right }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-gray-100 font-sans">
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:block w-[280px] bg-[#232323] border-r border-[#222] h-full">
          {sidebar}
        </aside>
        {/* Main Content */}
        <main className="flex-1 min-w-0 px-0 md:px-8 py-8">
          {main}
        </main>
        {/* Right Area (future expansion) */}
        <aside className="hidden lg:block w-[320px] bg-[#232323] border-l border-[#222] h-full">
          {right}
        </aside>
      </div>
    </div>
  );
};

export default ForumLayout; 