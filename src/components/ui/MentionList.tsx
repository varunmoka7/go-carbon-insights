import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { User } from 'lucide-react';

interface MentionListProps {
  items: { id: string; username: string; display_name?: string }[];
  command: (item: { id: string; username: string; display_name?: string }) => void;
}

const MentionList = forwardRef<any, MentionListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback((index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  }, [items, command]);

  const upHandler = useCallback(() => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  }, [selectedIndex, items.length]);

  const downHandler = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  }, [selectedIndex, items.length]);

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex);
  }, [selectItem, selectedIndex]);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!items.length) {
    return <div className="items-center px-4 py-2 text-sm text-gray-500">No users found</div>;
  }

  return (
    <div className="relative z-50">
      <div className="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${index === selectedIndex ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
            key={item.id}
            onClick={() => selectItem(index)}
          >
            <User className="w-4 h-4 text-gray-500" />
            <span>{item.display_name || item.username}</span>
            <span className="text-gray-400">@{item.username}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
