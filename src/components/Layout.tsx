
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart, Target, FileText, Home, Users, Settings, Search, Bell, Menu, ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/ui/Logo';
import GlobalSearch from './GlobalSearch';
import Breadcrumb from './Breadcrumb';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';
import ScrollToTop from './ScrollToTop';
import PageTransition from './PageTransition';
import Sidebar from './Sidebar';
import SidebarTrigger from './SidebarTrigger';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { isMobile, isCollapsed } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  // Check if we should show sidebar (exclude landing and auth pages)
  const showSidebar = !['/'].includes(location.pathname);

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (!showSidebar) return '';
    if (isMobile) return '';
    return isCollapsed ? 'ml-16' : 'ml-72';
  };

  // Simplified main navigation (6 core items + search + profile)
  const mainNavigation = [
    { name: t('navigation:home'), href: '/home', icon: Home },
    { name: t('navigation:dashboard'), href: '/dashboard', icon: BarChart },
    { 
      name: t('navigation:tracking'), 
      href: '/tracking', 
      icon: Target,
      dropdown: [
        { name: t('navigation:tracking'), href: '/tracking' },
        { name: t('navigation:scope1'), href: '/scope1' },
        { name: t('navigation:scope2'), href: '/scope2' },
        { name: t('navigation:scope3'), href: '/scope3' },
      ]
    },
    { name: t('navigation:decarbonization'), href: '/decarbonization', icon: Target },
    { name: 'Community', href: '/community', icon: MessageSquare },
  ];

  const isActive = (href: string) => location.pathname === href;
  const isTrackingActive = () => ['/tracking', '/scope1', '/scope2', '/scope3'].includes(location.pathname);

  // Reorganized footer sections with improved structure
  const footerSections = {
    platform: {
      title: 'Platform',
      links: [
        { name: t('navigation:about'), href: '/about' },
        { name: t('navigation:dashboard'), href: '/dashboard' },
        { name: t('navigation:methodology'), href: '/methodology' },
        { name: t('navigation:contact'), href: '/contact' },
      ]
    },
    tracking: {
      title: 'Emissions Tracking',
      links: [
        { name: t('scopes:scope1.title'), href: '/scope1' },
        { name: t('scopes:scope2.title'), href: '/scope2' },
        { name: t('scopes:scope3.title'), href: '/scope3' },
        { name: t('navigation:tracking'), href: '/tracking' },
      ]
    },
    analytics: {
      title: 'Analytics & Planning',
      links: [
        { name: 'Reports', href: '/reports' },
        { name: 'Analysis', href: '/analysis' },
        { name: 'Benchmarking', href: '/dashboard' },
        { name: t('navigation:decarbonization'), href: '/decarbonization' },
      ]
    },
    resources: {
      title: 'Resources & Support',
      links: [
        { name: 'Documentation', href: '/methodology' },
        { name: t('navigation:reference'), href: '/reference' },
        { name: 'Community', href: '/community' },
        { name: 'Support', href: '/contact' },
        { name: 'Privacy Policy', href: '/about' },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Scroll to top component - invisible but functional */}
      <ScrollToTop />

      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Top Navigation Bar */}
      <header className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-all duration-300 ${getMainContentMargin()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 md:py-4">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile sidebar trigger */}
              {showSidebar && <SidebarTrigger />}
              
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Logo size="small" className="rounded-lg md:hidden" />
                    <Logo size="medium" className="rounded-lg hidden md:block" />
                    <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      GoCarbonTracker
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-8 hidden sm:block">
                    Accelerating global supply chain decarbonization
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <GlobalSearch />
              
              <Button variant="outline" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>

              {/* Settings dropdown with language switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <div className="w-full">
                      <LanguageSwitcher />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative flex items-center gap-2 px-2 py-1 md:px-3 md:py-2 h-8 md:h-10">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.user_metadata?.display_name || user.user_metadata?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 w-full">
                        <Users className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" size="sm" className="h-8 md:h-10">
                  <Link to="/auth">
                    Login / Register
                  </Link>
                </Button>
              )}

              {!showSidebar && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="lg:hidden h-8 w-8 md:h-10 md:w-10"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu - only show when no sidebar */}
          {!showSidebar && mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-2">
                {mainNavigation.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <Icon className="h-4 w-4 inline mr-2" />
                          {item.name}
                        </div>
                        <div className="pl-6 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-3 py-2 rounded-md text-sm ${
                                isActive(subItem.href)
                                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 inline mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with Page Transitions */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${getMainContentMargin()}`}>
        {/* Global Back Button - positioned at top-left */}
        <div className="mb-4">
          <BackButton 
            variant="ghost" 
            size="sm"
            className="mb-2"
          />
        </div>
        
        <Breadcrumb />
        <PageTransition>
          <div role="main" aria-label="Main content">
            {children}
          </div>
        </PageTransition>
      </main>

      {/* Enhanced Footer */}
      <footer className={`bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-all duration-300 ${getMainContentMargin()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12">
            {/* Footer Header with Logo */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-3">
                  <Logo size="medium" className="rounded-lg" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      GoCarbonTracker
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Accelerating global supply chain decarbonization
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>Building the future of climate transparency</p>
                </div>
              </div>
            </div>

            {/* Footer Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {Object.entries(footerSections).map(([key, section]) => (
                <div key={key} className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 hover:underline"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Footer Info */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>© 2024 GoCarbonTracker. All rights reserved.</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Committed to climate transparency and action</span>
                </div>
                
                {/* Social Media Placeholder Section */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Follow our mission:
                  </span>
                  <div className="flex gap-2">
                    {/* Placeholder for future social media links */}
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">•</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">•</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">•</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
