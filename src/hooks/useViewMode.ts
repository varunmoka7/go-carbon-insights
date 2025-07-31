import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export type ViewMode = 'public' | 'private' | 'combined';

interface ViewModeState {
  currentMode: ViewMode;
  previousMode: ViewMode | null;
  isTransitioning: boolean;
}

interface UseViewModeReturn {
  currentMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isTransitioning: boolean;
  canAccessPrivateMode: boolean;
  getModeConfig: (mode: ViewMode) => {
    icon: string;
    label: string;
    description: string;
    route: string;
  };
}

const useViewMode = (): UseViewModeReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [viewModeState, setViewModeState] = useState<ViewModeState>({
    currentMode: 'public',
    previousMode: null,
    isTransitioning: false
  });

  // Determine initial mode based on current route
  useEffect(() => {
    const path = location.pathname;
    let initialMode: ViewMode = 'public';

    if (path.includes('/private') || path.includes('/organization')) {
      initialMode = 'private';
    } else if (path.includes('/combined') || path.includes('/analytics')) {
      initialMode = 'combined';
    }

    setViewModeState(prev => ({
      ...prev,
      currentMode: initialMode
    }));
  }, [location.pathname]);

  // Check if user can access private mode
  const canAccessPrivateMode = !!user;

  // Set view mode with transition handling
  const setViewMode = useCallback((mode: ViewMode) => {
    // Don't allow private/combined mode for non-authenticated users
    if ((mode === 'private' || mode === 'combined') && !canAccessPrivateMode) {
      console.warn('User must be authenticated to access private mode');
      return;
    }

    setViewModeState(prev => ({
      currentMode: mode,
      previousMode: prev.currentMode,
      isTransitioning: true
    }));

    // Navigate to appropriate route based on mode
    const routeMap = {
      public: '/dashboard',
      private: '/private/dashboard',
      combined: '/combined/dashboard'
    };

    const targetRoute = routeMap[mode];
    if (targetRoute && location.pathname !== targetRoute) {
      navigate(targetRoute);
    }

    // Clear transition state after a short delay
    setTimeout(() => {
      setViewModeState(prev => ({
        ...prev,
        isTransitioning: false
      }));
    }, 300);
  }, [canAccessPrivateMode, navigate, location.pathname]);

  // Get configuration for each mode
  const getModeConfig = useCallback((mode: ViewMode) => {
    const configs = {
      public: {
        icon: 'Globe',
        label: 'Public',
        description: 'Explore public data',
        route: '/dashboard'
      },
      private: {
        icon: 'Lock',
        label: 'Private',
        description: 'Your organization data',
        route: '/private/dashboard'
      },
      combined: {
        icon: 'Eye',
        label: 'Combined',
        description: 'Public + Private insights',
        route: '/combined/dashboard'
      }
    };

    return configs[mode];
  }, []);

  return {
    currentMode: viewModeState.currentMode,
    setViewMode,
    isTransitioning: viewModeState.isTransitioning,
    canAccessPrivateMode,
    getModeConfig
  };
};

export default useViewMode; 