import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FileText } from 'lucide-react';

const categories = [
  {
    name: 'General',
    color: 'bg-blue-600',
    active: true,
    articles: [
      'Welcome to the GoCarbonTracker Community!',
      'How to Get the Most from This Forum',
    ],
  },
  {
    name: 'Scope 1-2-3',
    color: 'bg-green-600',
    active: false,
    articles: [
      'Best Practices for Scope 3 Data Collection',
      'Scope 1 vs Scope 2: Key Differences',
      'Supplier Engagement for Scope 3 Reduction',
    ],
  },
  {
    name: 'Regulations',
    color: 'bg-yellow-600',
    active: false,
    articles: [
      'CSRD Compliance: What You Need to Know',
      'TCFD Reporting: Step-by-Step Guide',
      'SBTi Validation Timeline for Manufacturing',
    ],
  },
  {
    name: 'Software',
    color: 'bg-purple-600',
    active: false,
    articles: [
      'Choosing Carbon Accounting Software',
      'Integrating GHG Data with ERP Systems',
    ],
  },
  {
    name: 'Industry Specific',
    color: 'bg-pink-600',
    active: false,
    articles: [
      'Decarbonization in the Apparel Sector',
      'Emissions Benchmarking for Food & Beverage',
    ],
  },
];

const Categories: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [openArticles, setOpenArticles] = useState<string | null>(null);
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
                onClick={() => setOpenArticles(openArticles === cat.name ? null : cat.name)}
                aria-expanded={openArticles === cat.name}
                aria-controls={`cat-articles-${cat.name}`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.color} inline-block`} />
                {cat.name}
                {cat.articles && (
                  openArticles === cat.name ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
              {cat.articles && openArticles === cat.name && (
                <ul id={`cat-articles-${cat.name}`} className="ml-6 mt-1 space-y-1">
                  {cat.articles.map((article) => (
                    <li key={article}>
                      <button
                        className="flex items-center gap-2 px-2 py-1 rounded w-full text-xs text-gray-400 hover:text-emerald-200 hover:bg-[#232323] transition"
                        onClick={() => alert(`Open article: ${article}`)}
                      >
                        <FileText className="w-3 h-3 text-emerald-400" /> {article}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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