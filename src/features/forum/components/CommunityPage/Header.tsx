import React from 'react';
import { Leaf, Search, Bell, User, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#181818] border-b border-[#232323]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Leaf className="w-7 h-7 text-emerald-400" />
        <span className="text-xl font-bold text-white tracking-tight">GoCarbonTracker Community</span>
      </div>
      {/* Search Bar */}
      <div className="flex-1 mx-8 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics, categories, tags..."
            className="w-full rounded-lg bg-[#232323] text-gray-100 border border-[#333] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-emerald-400" />
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-[#232323] focus:outline-none">
          <Bell className="w-6 h-6 text-gray-300" />
          {/* Notification dot (future) */}
        </button>
        {/* User Avatar + Dropdown */}
        <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#232323] hover:bg-[#222] text-gray-100 font-medium focus:outline-none">
          <span className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base">SC</span>
          <span className="hidden md:inline">Dr. Sarah Chen</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {/* Ask Question CTA */}
        <button className="ml-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition">
          Ask Question
        </button>
      </div>
    </header>
  );
};

export default Header; 