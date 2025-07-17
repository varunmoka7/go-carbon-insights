import React from 'react';
import { Tag, Folder, Users, TrendingUp, FileText, Target, Zap, BarChart3, Scale, Database, Building2, Leaf, Truck } from 'lucide-react';

const iconMap = {
  'Scope 3 Emissions': TrendingUp,
  'Carbon Accounting': FileText,
  'Supply Chain Decarbonization': Truck,
  'GHG Protocol': Scale,
  'SBTi & Net Zero': Target,
  'PCAF & Finance': Database,
  'Reporting & Compliance': FileText,
  'Technology & Tools': Zap,
  'Industry Specific': Building2,
  'General Discussion': Users,
};

export default function CommunitySidebar({ categories, selectedCategory, setSelectedCategory, tags = [], quickLinks = [] }) {
  return (
    <aside className="w-64 p-4 border-r bg-white h-full flex flex-col gap-8 shadow-sm rounded-r-xl">
      <div>
        <h2 className="font-bold text-lg mb-4 text-emerald-700 flex items-center gap-2">
          <Folder className="h-5 w-5 text-emerald-500" /> Categories
        </h2>
        <ul className="space-y-1">
          {categories.map(cat => {
            const Icon = iconMap[cat.name] || Folder;
            const isActive = selectedCategory === cat.id;
            return (
              <li key={cat.id}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium text-left text-emerald-800 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 border ${isActive ? 'bg-emerald-100 border-emerald-400 shadow font-semibold' : 'border-transparent'}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {tags.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2 text-emerald-700 flex items-center gap-1">
            <Tag className="h-4 w-4 text-emerald-500" /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-100 border border-emerald-100 transition"
                // onClick={() => handleTagClick(tag)} // For future tag filtering
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      {quickLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Quick Links</h3>
          <ul className="space-y-1">
            {quickLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} className="text-emerald-700 hover:underline text-sm">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
} 