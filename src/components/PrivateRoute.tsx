import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, authFailed, isLoggingOut } = useAuth();
  const location = useLocation();

  // Show loading screen while authentication is in progress
  if (loading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // If authentication failed, the AuthContext will handle showing the error
  // This component should not render in that case, but just in case:
  if (authFailed) {
    return <Navigate to="/auth" state={{ from: location, message: 'Authentication failed. Please try again.' }} replace />;
  }

  // If user is logging out, allow the logout navigation to proceed
  if (!user && isLoggingOut) {
    return null; // Let the logout redirect handle navigation
  }

  // If no user and not logging out, redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location, message: 'Please sign in to access this feature' }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default PrivateRoute;