import React from 'react';
import { clearDemoMode, isDemoModeActive } from '@/utils/clearDemoMode';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const DemoModeClearer: React.FC = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    setIsActive(isDemoModeActive());
  }, []);

  const handleClearDemoMode = () => {
    clearDemoMode();
    setIsActive(false);
    // Reload the page to ensure all components pick up the change
    window.location.reload();
  };

  // Only show if demo mode is active and user is authenticated
  if (!isActive || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleClearDemoMode}
        variant="destructive"
        size="sm"
        className="text-xs"
      >
        Clear Demo Mode
      </Button>
    </div>
  );
};

export default DemoModeClearer; 