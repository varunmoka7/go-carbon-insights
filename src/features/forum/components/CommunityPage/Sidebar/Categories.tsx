import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, MessageSquare } from 'lucide-react';
import { useCommunityCategories } from '../../../hooks/useCommunityCategories';
import { useCommunityTopics } from '../../../hooks/useCommunityTopics';

interface CategoriesProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onTopicSelect?: (topicId: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ 
  selectedCategory, 
  onCategorySelect, 
  onTopicSelect 
}) => {
  const [open, setOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { categories, loading: categoriesLoading } = useCommunityCategories();

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    if (!expandedCategories.has(categoryId)) {
      toggleCategoryExpansion(categoryId);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="mt-8">
        <div className="text-gray-200 font-semibold text-xs uppercase tracking-wider mb-2">
          Categories
        </div>
        <div className="ml-6 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              isExpanded={expandedCategories.has(category.id)}
              onSelect={() => handleCategoryClick(category.id)}
              onToggleExpansion={() => toggleCategoryExpansion(category.id)}
              onTopicSelect={onTopicSelect}
            />
          ))}
          <li>
            <button 
              className="flex items-center gap-2 px-2 py-1 rounded-lg w-full text-xs text-gray-400 hover:text-emerald-200 mt-2"
              onClick={() => onCategorySelect?.('')}
            >
              <Folder className="w-4 h-4" /> All categories
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

interface CategoryItemProps {
  category: any;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpansion: () => void;
  onTopicSelect?: (topicId: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpansion,
  onTopicSelect,
}) => {
  const { topics, loading: topicsLoading } = useCommunityTopics(
    isExpanded ? category.id : undefined
  );

  const categoryColor = category.color || '#6366f1';

  return (
    <li>
      <button
        className={`flex items-center gap-2 px-2 py-1 rounded-lg w-full text-sm transition font-medium text-left focus:outline-none focus:ring-2 focus:ring-emerald-400 border ${
          isSelected 
            ? 'bg-[#232323] border-emerald-500 text-emerald-300 font-bold' 
            : 'border-transparent text-gray-300 hover:bg-[#232323] hover:text-emerald-200'
        }`}
        onClick={onSelect}
        aria-expanded={isExpanded}
        aria-controls={`cat-topics-${category.id}`}
      >
        <span 
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: categoryColor }}
        />
        {category.name}
        <button
          className="ml-auto focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpansion();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </button>
      
      {isExpanded && (
        <ul id={`cat-topics-${category.id}`} className="ml-6 mt-1 space-y-1">
          {topicsLoading ? (
            <li className="animate-pulse">
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </li>
          ) : topics.length === 0 ? (
            <li className="text-xs text-gray-500 italic px-2 py-1">
              No topics yet
            </li>
          ) : (
            topics.slice(0, 5).map((topic) => (
              <li key={topic.id}>
                <button
                  className="flex items-center gap-2 px-2 py-1 rounded w-full text-xs text-gray-400 hover:text-emerald-200 hover:bg-[#232323] transition"
                  onClick={() => onTopicSelect?.(topic.id)}
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{topic.title}</span>
                </button>
              </li>
            ))
          )}
          {topics.length > 5 && (
            <li>
              <button
                className="text-xs text-gray-500 hover:text-emerald-200 px-2 py-1"
                onClick={() => onTopicSelect?.(`category-${category.id}`)}
              >
                View all {topics.length} topics...
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default Categories; 