import React from 'react';

export default function CommunitySidebar({ categories, selectedCategory, setSelectedCategory, tags = [], quickLinks = [] }) {
  return (
    <aside className="w-64 p-4 border-r bg-white h-full flex flex-col gap-6">
      <div>
        <h2 className="font-bold text-lg mb-2">Categories</h2>
        <ul className="space-y-1">
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                className={`w-full text-left px-2 py-1 rounded ${selectedCategory === cat.id ? 'bg-emerald-100 font-semibold' : 'hover:bg-emerald-50'}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {tags.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs">{tag}</span>
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