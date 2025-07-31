import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock, Eye } from 'lucide-react';
import { ViewMode } from '@/hooks/useViewMode';

interface ViewModeIndicatorProps {
  currentMode: ViewMode;
  className?: string;
}

const ViewModeIndicator: React.FC<ViewModeIndicatorProps> = ({
  currentMode,
  className = ''
}) => {
  const getModeConfig = (mode: ViewMode) => {
    switch (mode) {
      case 'public':
        return {
          icon: Globe,
          label: 'Public',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'private':
        return {
          icon: Lock,
          label: 'Private',
          variant: 'default' as const,
          className: 'bg-teal-600 text-white'
        };
      case 'combined':
        return {
          icon: Eye,
          label: 'Combined',
          variant: 'secondary' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
    }
  };

  const config = getModeConfig(currentMode);

  return (
    <Badge 
      variant={config.variant}
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium ${config.className} ${className}`}
    >
      <config.icon className="h-3 w-3" />
      <span className="hidden sm:inline">{config.label}</span>
    </Badge>
  );
};

export default ViewModeIndicator; 