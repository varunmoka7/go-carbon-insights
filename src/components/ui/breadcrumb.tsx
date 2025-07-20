import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index < items.length - 1 ? (
              <>
                <Link
                  to={item.href}
                  className="hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            ) : (
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;