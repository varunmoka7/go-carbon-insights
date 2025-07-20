import React from 'react';
import { AlertTriangle, RefreshCw, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';

interface ErrorFallbackProps {
  message?: string;
  error?: Error;
  onRetry?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  message = "Something went wrong",
  error,
  onRetry,
  showRetry = true,
  showHome = true,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleOpenSettings = () => {
    console.log('Environment Variables:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' : 'Not set');
    console.log('VITE_DEMO_MODE:', import.meta.env.VITE_DEMO_MODE);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo size="medium" className="mx-auto rounded-lg mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            GoCarbonTracker
          </h1>
        </div>

        {/* Error Card */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-800 dark:text-red-200">
              Application Error
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              {message}
            </p>

            {/* Error Details */}
            {error && (
              <details className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded border">
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technical Details
                </summary>
                <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\nStack Trace:'}
                      {'\n'}{error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              {showRetry && (
                <Button 
                  onClick={handleRetry} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}

              {showHome && (
                <Button 
                  onClick={handleGoHome} 
                  variant="outline" 
                  className="w-full border-gray-300 dark:border-gray-600"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              )}

              <Button 
                onClick={handleOpenSettings} 
                variant="ghost" 
                size="sm"
                className="w-full text-xs text-gray-500"
              >
                <Settings className="w-3 h-3 mr-2" />
                Debug Environment
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t">
              <p>If this problem persists, please check your network connection and environment configuration.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorFallback;