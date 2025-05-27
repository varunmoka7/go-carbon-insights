
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'Reports', path: '/reports' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <BarChart className="h-8 w-8 text-teal-600" />
                <span className="text-xl font-bold text-gray-900">GoCarbonTracker</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:text-teal-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
