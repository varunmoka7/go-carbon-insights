import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';

const DMs: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-8">
      <button
        className="flex items-center w-full text-gray-200 font-semibold text-xs uppercase tracking-wider mb-2 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sidebar-dms"
      >
        {open ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
        DMs
      </button>
      {open && (
        <div id="sidebar-dms" className="ml-6 text-gray-400 text-sm flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-400" /> Direct Messages (coming soon)
        </div>
      )}
    </div>
  );
};

export default DMs; 