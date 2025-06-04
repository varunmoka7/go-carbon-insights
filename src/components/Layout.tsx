
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Target, FileText, Home, Users, Settings, Search, Bell, Menu, Info, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/ui/Logo';
import GlobalSearch from './GlobalSearch';
import Breadcrumb from './Breadcrumb';
import LogoutButton from './LogoutButton';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: MessageCircle },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart },
    { name: 'Tracking', href: '/tracking', icon: Target },
    { name: 'Scope 1', href: '/scope1', icon: BarChart },
    { name: 'Scope 2', href: '/scope2', icon: BarChart },
    { name: 'Scope 3', href: '/scope3', icon: BarChart },
    { name: 'Decarbonization', href: '/decarbonization', icon: Target },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Analysis', href: '/analysis', icon: BarChart },
    { name: 'Reference', href: '/reference', icon: FileText },
    { name: 'Profile', href: '/profile', icon: Users },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <Link to="/home" className="flex items-center gap-2">
                <Logo size="medium" className="rounded-lg" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  GoCarbonTracker
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigation.slice(0, 9).map((item) => {
                  const Icon = item.icon;
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

              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <div role="main" aria-label="Main content">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
                {navigation.slice(3, 7).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Analytics</h3>
              <div className="space-y-2">
                {navigation.slice(7, 10).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <div className="space-y-2">
                <Link to="/methodology" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  Methodology
                </Link>
                <Link to="/reference" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  Reference
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
                <Link to="/profile" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2024 GoCarbonTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
