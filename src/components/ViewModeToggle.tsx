import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Lock, 
  Layers, 
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useViewModeContext } from '@/contexts/ViewModeContext';

const ViewModeToggle: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    canAccessPrivateMode, 
    canAccessCombinedMode 
  } = useViewModeContext();

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'combined':
        return <Layers className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private';
      case 'combined':
        return 'Combined';
      default:
        return 'Public';
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'public':
        return 'Explore public ESG data';
      case 'private':
        return 'Manage your organization data';
      case 'combined':
        return 'View public and private data together';
      default:
        return 'Explore public ESG data';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 h-9 px-3"
        >
          {getModeIcon(viewMode)}
          <span className="hidden sm:inline">{getModeLabel(viewMode)}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {/* Public Mode Button */}
        <DropdownMenuItem 
          onClick={() => setViewMode('public')}
          className="flex items-center gap-3 p-3"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <div>
              <div className="font-medium">Public</div>
              <div className="text-xs text-muted-foreground">
                Explore public ESG data
              </div>
            </div>
          </div>
          {viewMode === 'public' && (
            <Badge variant="default" className="ml-auto">Current</Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Private Mode Button - Only show if user can access private mode */}
        {canAccessPrivateMode && (
          <DropdownMenuItem 
            onClick={() => setViewMode('private')}
            className="flex items-center gap-3 p-3"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <div>
                <div className="font-medium">Private</div>
                <div className="text-xs text-muted-foreground">
                  Manage your organization data
                </div>
              </div>
            </div>
            {viewMode === 'private' && (
              <Badge variant="default" className="ml-auto">Current</Badge>
            )}
          </DropdownMenuItem>
        )}

        {/* Combined Mode Button - Only show if user can access combined mode */}
        {canAccessCombinedMode && (
          <DropdownMenuItem 
            onClick={() => setViewMode('combined')}
            className="flex items-center gap-3 p-3"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <div>
                <div className="font-medium">Combined</div>
                <div className="text-xs text-muted-foreground">
                  View public and private data together
                </div>
              </div>
            </div>
            {viewMode === 'combined' && (
              <Badge variant="default" className="ml-auto">Current</Badge>
            )}
          </DropdownMenuItem>
        )}

        {/* Private Mode Access Button - Show for non-authenticated users */}
        {!canAccessPrivateMode && (
          <DropdownMenuItem 
            onClick={() => setViewMode('private')}
            className="flex items-center gap-3 p-3"
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <div>
                <div className="font-medium">Private Mode</div>
                <div className="text-xs text-muted-foreground">
                  Sign in to access private features
                </div>
              </div>
            </div>
            <Badge variant="outline" className="ml-auto">Sign In</Badge>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeToggle; 