import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, Search, Bell, Menu, ChevronDown, Users, Home, MessageSquare, User } from 'lucide-react';
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
import LogoutButton from './LogoutButton';
import ScrollToTop from './ScrollToTop';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface CommunityLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children, sidebar }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store the currently focused element
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      // Focus the sidebar
      sidebarRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Return focus to the previously focused element
    lastFocusedElementRef.current?.focus();
  };

  // Trap focus within the mobile sidebar
  const handleSidebarKeyDown = (event: React.KeyboardEvent) => {
    if (!mobileMenuOpen) return;

    if (event.key === 'Tab') {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      const focusableElements = sidebar.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Scroll to top component */}
      <ScrollToTop />

      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              {/* Mobile menu trigger */}
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden"
                onClick={openMobileMenu}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-sidebar"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Logo size="medium" className="rounded-lg" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      GoCarbonTracker
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-8 hidden sm:block">
                    Community Forum
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearch />
              
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* Settings dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
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
                    <Button variant="ghost" className="relative flex items-center gap-2 px-3 py-2">
                      <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
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
                <Button asChild variant="outline">
                  <Link to="/auth">
                    Login / Register
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-2">
                <Link
                  to="/home"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={closeMobileMenu}
                >
                  Back to Dashboard
                </Link>
                <Link
                  to="/community"
                  className="block px-3 py-2 rounded-md text-sm font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                  onClick={closeMobileMenu}
                >
                  Community Forum
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Two-Column Layout */}
      <div className="flex min-h-[calc(100vh-73px)] pb-16 md:pb-0">
        {/* Persistent Left Sidebar */}
        <aside className="hidden md:block w-[280px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          {sidebar}
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" 
            onClick={closeMobileMenu}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-sidebar-title"
          >
            <aside 
              ref={sidebarRef}
              id="mobile-sidebar"
              className="w-[280px] bg-white dark:bg-gray-800 h-full overflow-y-auto focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleSidebarKeyDown}
              tabIndex={-1}
            >
              <div className="sr-only" id="mobile-sidebar-title">
                Navigation Menu
              </div>
              {sidebar}
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-900">
          <div role="main" aria-label="Community content">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
        <div className="flex justify-around h-16 items-center">
          <Link to="/community" className="flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-full h-full">
            <Home className="h-5 w-5 mb-1" />
            Home
          </Link>
          <Link to="/search" className="flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-full h-full">
            <Search className="h-5 w-5 mb-1" />
            Search
          </Link>
          <Link to="/community/new-topic" className="flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-full h-full">
            <MessageSquare className="h-5 w-5 mb-1" />
            New Topic
          </Link>
          <Link to="/profile" className="flex flex-col items-center justify-center text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 w-full h-full">
            <User className="h-5 w-5 mb-1" />
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default CommunityLayout;