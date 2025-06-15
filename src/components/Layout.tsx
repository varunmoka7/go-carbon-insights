import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Target, FileText, Home, Users, Settings, Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/ui/Logo';
import GlobalSearch from './GlobalSearch';
import Breadcrumb from './Breadcrumb';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';
import ScrollToTop from './ScrollToTop';
import PageTransition from './PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simplified main navigation (5 core items + search + profile)
  const mainNavigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart },
    { 
      name: 'Tracking', 
      href: '/tracking', 
      icon: Target,
      dropdown: [
        { name: 'Tracking Overview', href: '/tracking' },
        { name: 'Scope 1 Emissions', href: '/scope1' },
        { name: 'Scope 2 Emissions', href: '/scope2' },
        { name: 'Scope 3 Emissions', href: '/scope3' },
      ]
    },
    { name: 'Decarbonization', href: '/decarbonization', icon: Target },
    { name: 'Donate', href: '/donate', icon: Users },
  ];

  const isActive = (href: string) => location.pathname === href;
  const isTrackingActive = () => ['/tracking', '/scope1', '/scope2', '/scope3'].includes(location.pathname);

  // Reorganized footer sections with improved structure
  const footerSections = {
    platform: {
      title: 'Platform',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Methodology', href: '/methodology' },
        { name: 'Contact', href: '/contact' },
        { name: 'Donate', href: '/donate' },
      ]
    },
    tracking: {
      title: 'Emissions Tracking',
      links: [
        { name: 'Scope 1 Emissions', href: '/scope1' },
        { name: 'Scope 2 Emissions', href: '/scope2' },
        { name: 'Scope 3 Emissions', href: '/scope3' },
        { name: 'Tracking Overview', href: '/tracking' },
      ]
    },
    analytics: {
      title: 'Analytics & Planning',
      links: [
        { name: 'Reports', href: '/reports' },
        { name: 'Analysis', href: '/analysis' },
        { name: 'Benchmarking', href: '/dashboard' },
        { name: 'Decarbonization', href: '/decarbonization' },
      ]
    },
    resources: {
      title: 'Resources & Support',
      links: [
        { name: 'Documentation', href: '/methodology' },
        { name: 'Reference', href: '/reference' },
        { name: 'Support', href: '/contact' },
        { name: 'Privacy Policy', href: '/about' },
        { name: 'Donate', href: '/donate' },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Scroll to top component - invisible but functional */}
      <ScrollToTop />

      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Logo size="medium" className="rounded-lg" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      GoCarbonTracker
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-8 hidden sm:block">
                    Accelerating global supply chain decarbonization
                  </span>
                </div>
              </Link>
              
              {/* Desktop Navigation - Simplified to 5 core items */}
              <nav className="hidden lg:flex items-center space-x-1">
                {mainNavigation.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.dropdown) {
                    return (
                      <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                              isTrackingActive()
                                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {item.dropdown.map((subItem) => (
                            <DropdownMenuItem key={subItem.name} asChild>
                              <Link 
                                to={subItem.href}
                                className={`w-full ${
                                  isActive(subItem.href) 
                                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' 
                                    : ''
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 inline mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearch />
              
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>

              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </span>
                  <LogoutButton />
                </div>
              )}

              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
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
