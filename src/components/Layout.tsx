
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Target, 
  FileText, 
  TrendingUp, 
  User,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import ScopeDropdown from './ScopeDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Tracking', href: '/tracking', icon: Target },
    { name: 'Decarbonization', href: '/decarbonization', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Analysis', href: '/analysis', icon: TrendingUp },
  ];

  const resourceNavigation = [
    { name: 'Methodology', href: '/methodology', icon: BookOpen },
    { name: 'Reference', href: '/reference', icon: ExternalLink },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="backdrop-blur-lg bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/9efb52bb-4927-4097-8968-6bfba4ce29c0.png" 
                alt="GoCarbonTracker" 
                className="h-10 w-auto"
              />
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Scope Dropdown */}
              <ScopeDropdown />

              {/* Resources Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  <span>Resources</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {resourceNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 first:rounded-t-md last:rounded-b-md"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center">
              <Link
                to="/profile"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
