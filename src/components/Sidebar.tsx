
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  BarChart, 
  Factory, 
  Zap, 
  Truck, 
  Target, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  Globe,
  Eye,
  Info,
  Mail,
  BookOpen
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import ComingSoonDialog from './ComingSoonDialog';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const Sidebar: React.FC = () => {
  const { isOpen, isMobile, isCollapsed, close, setCollapsed } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  const [isComingSoonOpen, setComingSoonOpen] = useState(false);
  
  // Check if in demo mode
  const urlParams = new URLSearchParams(location.search);
  const isDemoMode = urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true';
  
  // Demo-allowed navigation items
  const demoAllowedItems = [
    '/home',
    '/dashboard', 
    '/industry-glossary',
    '/industry-analysis',
    '/scope1',
    '/scope2', 
    '/scope3',
    '/about',
    '/contact',
    '/methodology'
  ];

  const allNavigationItems: NavigationItem[] = [
    { 
      name: t('navigation:home') || 'Home', 
      href: '/home', 
      icon: Home, 
      description: 'Overview'
    },
    { 
      name: t('navigation:dashboard') || 'Dashboard', 
      href: '/dashboard', 
      icon: BarChart, 
      description: 'Analytics'
    },
    { 
      name: 'Industry Glossary', 
      href: '/industry-glossary', 
      icon: Building, 
      description: 'ESG industry taxonomy' 
    },
    { 
      name: 'Industry Analysis', 
      href: '/industry-analysis', 
      icon: Globe, 
      description: 'Sector-specific analysis' 
    },
    { 
      name: 'Scope 1', 
      href: '/scope1', 
      icon: Factory, 
      description: 'Direct emissions' 
    },
    { 
      name: 'Scope 2', 
      href: '/scope2', 
      icon: Zap, 
      description: 'Energy emissions' 
    },
    { 
      name: 'Scope 3', 
      href: '/scope3', 
      icon: Truck, 
      description: 'Value chain emissions' 
    },
    { 
      name: 'Reports & Analytics', 
      href: '/reports-analytics', 
      icon: FileText, 
      description: 'Reports & analysis' 
    },
    { 
      name: 'Decarbonization', 
      href: '/decarbonization', 
      icon: Target, 
      description: 'Strategy planning' 
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: Info, 
      description: 'About platform' 
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: Mail, 
      description: 'Contact us' 
    },
    { 
      name: 'Methodology', 
      href: '/methodology', 
      icon: BookOpen, 
      description: 'Methodology docs' 
    },
  ];

  const navigationItems = allNavigationItems;

  const isActive = (href: string) => {
    if (href === '/industry-analysis') {
      return location.pathname === href || location.pathname.startsWith('/industry-analysis/');
    }
    return location.pathname === href;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isDemoMode && !demoAllowedItems.includes(href)) {
      e.preventDefault();
      setComingSoonOpen(true);
    } else if (isMobile) {
      close();
    }
  };

  const handleBackdropClick = () => {
    if (isMobile) {
      close();
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!isCollapsed);
  };

  // Don't render sidebar on landing page
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }

  return (
    <>
      <ComingSoonDialog isOpen={isComingSoonOpen} onClose={() => setComingSoonOpen(false)} />
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-280` 
            : `${isCollapsed ? 'w-16' : 'w-72'}`
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex flex-col gap-1">
              <Link to="/home" className="flex items-center gap-2">
                <Logo size="small" className="rounded-lg" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  GoCarbonTracker
                </span>
              </Link>
              {isDemoMode && (
                <div className="flex items-center gap-1 ml-8">
                  <Eye className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    Demo Mode
                  </span>
                </div>
              )}
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-full flex justify-center">
              <Logo size="small" className="rounded-lg" />
            </div>
          )}

          {/* Collapse button for desktop */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const isDisabled = isDemoMode && !demoAllowedItems.includes(item.href);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${active 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                        : isDisabled
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.name : ''}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        {item.description && (
                          <span className="text-xs opacity-70">{item.description}</span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium">GoCarbonTracker</p>
              <p>Accelerating decarbonization</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
