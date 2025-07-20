import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  fullScreen = true 
}) => {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingFallback;