import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface ProtectedModerationRouteProps {
  children: React.ReactNode;
}

// Mock function to check user role - replace with actual implementation
const getUserRole = (user: any): string => {
  // In a real app, this would check the user's role from the database
  // For demo purposes, we'll assume certain users are moderators/admins
  
  // Demo: Check if user email contains 'admin' or 'moderator'
  if (user?.email?.includes('admin')) return 'admin';
  if (user?.email?.includes('moderator')) return 'moderator';
  
  // Check user metadata for role
  if (user?.user_metadata?.role) return user.user_metadata.role;
  
  // Default to user role
  return 'user';
};

export const ProtectedModerationRoute: React.FC<ProtectedModerationRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return path
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const userRole = getUserRole(user);
  const isAuthorized = ['admin', 'moderator'].includes(userRole);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Shield className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold">Access Denied</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    You don't have permission to access the moderation dashboard. 
                    Administrator or moderator privileges are required.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Current role: <span className="font-mono bg-gray-100 px-1 rounded">{userRole}</span>
                  </p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Go Back
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};