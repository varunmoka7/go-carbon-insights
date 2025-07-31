import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ViewMode = 'public' | 'private' | 'combined';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isTransitioning: boolean;
  canAccessPrivateMode: boolean;
  canAccessCombinedMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>('public');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user can access private/combined modes
  const canAccessPrivateMode = true; // TODO: Replace with actual auth check
  const canAccessCombinedMode = canAccessPrivateMode;

  // Initialize view mode from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/private') || path.includes('/admin')) {
      setViewModeState('private');
    } else if (path.includes('/combined')) {
      setViewModeState('combined');
    } else {
      setViewModeState('public');
    }
  }, [location.pathname]);

  // Handle view mode changes with navigation
  const setViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;

    setIsTransitioning(true);

    // Navigate to appropriate route based on mode
    switch (mode) {
      case 'private':
        if (canAccessPrivateMode) {
          navigate('/private/dashboard');
        } else {
          navigate('/auth?redirect=/private');
          return;
        }
        break;
      case 'combined':
        if (canAccessCombinedMode) {
          navigate('/combined/dashboard');
        } else {
          navigate('/auth?redirect=/combined');
          return;
        }
        break;
      case 'public':
        navigate('/dashboard');
        break;
    }

    setViewModeState(mode);

    // End transition after navigation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const value: ViewModeContextType = {
    viewMode,
    setViewMode,
    isTransitioning,
    canAccessPrivateMode,
    canAccessCombinedMode,
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewModeContext = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewModeContext must be used within a ViewModeProvider');
  }
  return context;
};