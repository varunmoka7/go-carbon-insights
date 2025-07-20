import React from 'react';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="large" className="rounded-lg" />
        </div>
        
        {/* App Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            GoCarbonTracker
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Accelerating global supply chain decarbonization
          </p>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">{message}</p>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div className="bg-teal-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;