import React from 'react';

interface Participant {
  name: string;
  initials: string;
  color: string;
}

interface UserAvatarsProps {
  participants: Participant[];
}

const UserAvatars: React.FC<UserAvatarsProps> = ({ participants }) => {
  return (
    <div className="flex -space-x-2">
      {participants.slice(0, 3).map((p, i) => (
        <span
          key={p.name}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#1a1a1a] ${p.color}`}
          aria-label={p.name}
          title={p.name}
        >
          {p.initials}
        </span>
      ))}
      {participants.length > 3 && (
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gray-700 border-2 border-[#1a1a1a] text-white" title={`+${participants.length - 3} more`}>
          +{participants.length - 3}
        </span>
      )}
    </div>
  );
};

export default UserAvatars; 