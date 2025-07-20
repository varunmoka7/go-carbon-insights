import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, isLoggingOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logging out, allow the logout navigation to proceed
  if (!user && isLoggingOut) {
    return null; // Let the logout redirect handle navigation
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location, message: 'Please sign in to access this feature' }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;