
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  customText?: string;
}

const BackButton = ({ 
  className, 
  variant = 'ghost', 
  size = 'default',
  showText = true,
  customText
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define parent routes for logical fallback navigation
  const parentRoutes: Record<string, string> = {
    '/scope1': '/tracking',
    '/scope2': '/tracking',
    '/scope3': '/tracking',
    '/tracking': '/dashboard',
    '/decarbonization': '/dashboard',
    '/reports': '/dashboard',
    '/analysis': '/dashboard',
    '/methodology': '/dashboard',
    '/reference': '/dashboard',
    '/profile': '/dashboard',
    '/dashboard': '/home',
    '/about': '/',
    '/contact': '/',
  };

  // Don't show back button on these pages
  const hiddenRoutes = ['/', '/home', '/auth', '/landing'];
  
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to logical parent route
      const parentRoute = parentRoutes[location.pathname] || '/dashboard';
      navigate(parentRoute);
    }
  };

  const getBackText = () => {
    if (customText) return customText;
    
    // Get logical back destination for display
    const parentRoute = parentRoutes[location.pathname];
    const routeNames: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/tracking': 'Tracking',
      '/home': 'Home',
      '/': 'Home'
    };
    
    const destination = routeNames[parentRoute || '/dashboard'] || 'Back';
    return showText ? `Back to ${destination}` : '';
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn(
        'flex items-center gap-2 transition-all duration-200 hover:scale-105',
        !showText && 'p-2',
        className
      )}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-4 w-4" />
      {showText && (
        <span className="hidden sm:inline">
          {getBackText()}
        </span>
      )}
    </Button>
  );
};

export default BackButton;
