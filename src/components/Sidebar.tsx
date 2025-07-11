
import React from 'react';
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
  Globe
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';

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

  const navigationItems: NavigationItem[] = [
    { name: t('navigation:home'), href: '/home', icon: Home, description: t('dashboard:overview') },
    { name: t('navigation:dashboard'), href: '/dashboard', icon: BarChart, description: t('dashboard:analytics') },
    { name: 'Industry Glossary', href: '/industry-glossary', icon: Building, description: 'ESG industry taxonomy' },
    { name: t('navigation:industryAnalysis'), href: '/industry-analysis', icon: Building, description: 'Sector-specific analysis' },
    { name: t('scopes:scope1.title'), href: '/scope1', icon: Factory, description: t('scopes:scope1.description') },
    { name: t('scopes:scope2.title'), href: '/scope2', icon: Zap, description: t('scopes:scope2.description') },
    { name: t('scopes:scope3.title'), href: '/scope3', icon: Truck, description: t('scopes:scope3.description') },
    { name: t('navigation:reportsAnalytics'), href: '/reports-analytics', icon: FileText, description: 'Reports & analysis' },
    { name: t('navigation:decarbonization'), href: '/decarbonization', icon: Target, description: 'Strategy planning' },
    { name: t('navigation:donate'), href: '/donate', icon: Users, description: 'Support our mission' },
  ];

  const isActive = (href: string) => {
    if (href === '/industry-analysis') {
      return location.pathname === href || location.pathname.startsWith('/industry-analysis/');
    }
    return location.pathname === href;
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
            <Link to="/home" className="flex items-center gap-2">
              <Logo size="small" className="rounded-lg" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                GoCarbonTracker
              </span>
            </Link>
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
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => isMobile && close()}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${active 
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
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
