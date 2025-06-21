
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    console.log('🔄 Navigation loading started for:', location.pathname);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Navigation loading completed for:', location.pathname);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  );
};

export default NavigationLoader;
