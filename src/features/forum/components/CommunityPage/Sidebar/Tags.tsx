import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';

const tags = [
  'SBTi',
  'GHG Protocol',
  'CSRD',
  'Carbon Accounting',
  'Supply Chain',
  'Net Zero',
];

const Tags: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-8">
      <button
        className="flex items-center w-full text-gray-200 font-semibold text-xs uppercase tracking-wider mb-2 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sidebar-tags"
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        Tags
      </button>
      {open && (
        <div id="sidebar-tags" className="flex flex-wrap gap-2 ml-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#232323] text-emerald-200 border border-emerald-700 rounded-full px-3 py-1 text-xs font-medium cursor-pointer hover:bg-emerald-900 hover:text-white transition"
            >
              <Tag className="inline w-3 h-3 mr-1 text-emerald-400" />{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tags; 