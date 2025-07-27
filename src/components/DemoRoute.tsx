import React from 'react';
import { useLocation } from 'react-router-dom';

interface DemoRouteProps {
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
  '/about',
  '/contact',
  '/methodology'
];

const DemoRoute: React.FC<DemoRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if current page is allowed in demo mode
  const isDemoAllowed = DEMO_ALLOWED_PAGES.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );
  
  // Get demo mode from URL params or localStorage
  const urlParams = new URLSearchParams(location.search);
  const isDemoMode = urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true';
  
  // If in demo mode and page is allowed, render children
  if (isDemoMode && isDemoAllowed) {
    return <>{children}</>;
  }
  
  // Otherwise, let normal authentication flow handle it
  return <>{children}</>;
};

export default DemoRoute;