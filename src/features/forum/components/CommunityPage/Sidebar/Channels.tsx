import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';

const channels = [
  { name: '# general' },
  { name: '# scope-3-discussions' },
];

const Channels: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-8">
      <button
        className="flex items-center w-full text-gray-200 font-semibold text-xs uppercase tracking-wider mb-2 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sidebar-channels"
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        Channels
      </button>
      {open && (
        <ul id="sidebar-channels" className="space-y-1 ml-6">
          {channels.map((ch) => (
            <li key={ch.name}>
              <span className="flex items-center gap-2 px-2 py-1 rounded-lg w-full text-sm text-gray-300 hover:text-emerald-200 cursor-pointer">
                <Hash className="w-4 h-4 text-emerald-400" /> {ch.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Channels; 