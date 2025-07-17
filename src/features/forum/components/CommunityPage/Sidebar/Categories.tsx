import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';

const categories = [
  { name: 'General', color: 'bg-blue-600', active: true },
  { name: 'Scope 1-2-3', color: 'bg-green-600', active: false },
  { name: 'Regulations', color: 'bg-yellow-600', active: false },
  { name: 'Software', color: 'bg-purple-600', active: false },
  { name: 'Industry Specific', color: 'bg-pink-600', active: false },
];

const Categories: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-8">
      <button
        className="flex items-center w-full text-gray-200 font-semibold text-xs uppercase tracking-wider mb-2 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sidebar-categories"
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        Categories
      </button>
      {open && (
        <ul id="sidebar-categories" className="space-y-1 ml-6">
          {categories.map((cat) => (
            <li key={cat.name}>
              <button
                className={`flex items-center gap-2 px-2 py-1 rounded-lg w-full text-sm transition font-medium text-left focus:outline-none focus:ring-2 focus:ring-emerald-400 border ${cat.active ? 'bg-[#232323] border-emerald-500 text-emerald-300 font-bold' : 'border-transparent text-gray-300 hover:bg-[#232323] hover:text-emerald-200'}`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.color} inline-block`} />
                {cat.name}
              </button>
            </li>
          ))}
          <li>
            <button className="flex items-center gap-2 px-2 py-1 rounded-lg w-full text-xs text-gray-400 hover:text-emerald-200 mt-2">
              <Folder className="w-4 h-4" /> All categories
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Categories; 