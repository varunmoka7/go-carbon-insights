import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface DemoAwareRouteProps {
  children: React.ReactNode;
}

// Demo-allowed pages
const DEMO_ALLOWED_PAGES = [
  '/home',
  '/dashboard', 
  '/industry-glossary',
  '/industry-analysis',
  '/scope1',
  '/scope2', 
  '/scope3',
  '/decarbonization',
  '/about',
  '/contact',
  '/methodology'
];

const DemoAwareRoute: React.FC<DemoAwareRouteProps> = ({ children }) => {
  const { user, loading, authFailed, isLoggingOut } = useAuth();
  const location = useLocation();
  
  // Check if current page is allowed in demo mode
  const isDemoAllowed = DEMO_ALLOWED_PAGES.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );
  
  // Get demo mode from URL params or localStorage
  const urlParams = new URLSearchParams(location.search);
  const isDemoMode = urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true';
  
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

  // If in demo mode and page is allowed, grant access without authentication
  if (isDemoMode && isDemoAllowed) {
    return <>{children}</>;
  }

  // If no user and not in demo mode (or page not allowed in demo), redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location, message: 'Please sign in to access this feature' }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default DemoAwareRoute;