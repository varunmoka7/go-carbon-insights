import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, color }) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color} bg-opacity-20 border border-opacity-30 border-white mr-2`}
      style={{ minWidth: 80 }}
    >
      {name}
    </span>
  );
};

export default CategoryBadge; 