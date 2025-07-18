import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const SimpleHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="small" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">GoCarbonTracker</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
                <Link to="/tracking" className="text-gray-700 hover:text-gray-900 font-medium">
                  Tracking
                </Link>
                <Link to="/community" className="text-gray-700 hover:text-gray-900 font-medium">
                  Community
                </Link>
              </>
            ) : (
              <>
                <Link to="/industry-analysis" className="text-gray-700 hover:text-gray-900 font-medium">
                  Industry Analysis
                </Link>
                <Link to="/methodology" className="text-gray-700 hover:text-gray-900 font-medium">
                  Methodology
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium">
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Sign In / Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;