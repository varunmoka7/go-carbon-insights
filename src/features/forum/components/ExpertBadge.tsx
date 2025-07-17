import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ExpertBadgeProps {
  isExpert?: boolean;
  isTeamMember?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ExpertBadge: React.FC<ExpertBadgeProps> = ({
  isExpert = false,
  isTeamMember = false,
  size = 'md',
  className = '',
}) => {
  if (!isExpert && !isTeamMember) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const badgeContent = isTeamMember ? (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <CheckCircle className={`${sizeClasses[size]} text-emerald-600 animate-pulse`} />
      <span className="text-xs font-medium text-emerald-700 hidden sm:inline">
        GCT Expert
      </span>
    </div>
  ) : (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <CheckCircle className={`${sizeClasses[size]} text-blue-600`} />
      <span className="text-xs font-medium text-blue-700 hidden sm:inline">
        Expert
      </span>
    </div>
  );

  return (
    <div
      className="gct-team-badge"
      title={isTeamMember ? 'GoCarbonTracker Team Member' : 'Community Expert'}
    >
      {badgeContent}
    </div>
  );
};

export default ExpertBadge;