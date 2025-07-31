import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ViewModeToggleProps {
  currentMode: 'public' | 'private' | 'combined';
  onModeChange: (mode: 'public' | 'private' | 'combined') => void;
  showPrivateMode?: boolean;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  showPrivateMode = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrivateModeClick = () => {
    if (!user) {
      navigate('/auth?redirect=/private');
      return;
    }
    onModeChange('private');
  };

  const getModeConfig = (mode: 'public' | 'private' | 'combined') => {
    switch (mode) {
      case 'public':
        return {
          icon: Globe,
          label: 'Public',
          description: 'Explore public data',
          variant: 'outline' as const,
          className: 'border-blue-200 text-blue-700 hover:bg-blue-50'
        };
      case 'private':
        return {
          icon: Lock,
          label: 'Private',
          description: 'Your organization data',
          variant: 'default' as const,
          className: 'bg-teal-600 text-white hover:bg-teal-700'
        };
      case 'combined':
        return {
          icon: Eye,
          label: 'Combined',
          description: 'Public + Private insights',
          variant: 'outline' as const,
          className: 'border-purple-200 text-purple-700 hover:bg-purple-50'
        };
    }
  };

  const currentConfig = getModeConfig(currentMode);

  return (
    <div className="flex items-center gap-2">
      {/* Public Mode Button */}
      <Button
        variant={currentMode === 'public' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onModeChange('public')}
        className={`flex items-center gap-2 ${
          currentMode === 'public' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
        }`}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">Public</span>
      </Button>

      {/* Private Mode Button - Only show if user is authenticated */}
      {showPrivateMode && user && (
        <Button
          variant={currentMode === 'private' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('private')}
          className={`flex items-center gap-2 ${
            currentMode === 'private' 
              ? 'bg-teal-600 text-white hover:bg-teal-700' 
              : 'border-teal-200 text-teal-700 hover:bg-teal-50'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Private</span>
        </Button>
      )}

      {/* Combined Mode Button - Only show if user is authenticated */}
      {showPrivateMode && user && (
        <Button
          variant={currentMode === 'combined' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModeChange('combined')}
          className={`flex items-center gap-2 ${
            currentMode === 'combined' 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'border-purple-200 text-purple-700 hover:bg-purple-50'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Combined</span>
        </Button>
      )}

      {/* Private Mode Access Button - Show for non-authenticated users */}
      {showPrivateMode && !user && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrivateModeClick}
          className="flex items-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          <Lock className="h-4 w-4" />
          <span className="hidden sm:inline">Private Mode</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            Login
          </Badge>
        </Button>
      )}

      {/* Current Mode Indicator */}
      <div className="hidden md:flex items-center gap-2 ml-2 text-sm text-gray-600 dark:text-gray-400">
        <currentConfig.icon className="h-4 w-4" />
        <span>{currentConfig.description}</span>
      </div>
    </div>
  );
};

export default ViewModeToggle; 