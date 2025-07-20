import { useEffect } from 'react';

interface Shortcut {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const { key, altKey, ctrlKey, shiftKey, handler, preventDefault = true } = shortcut;

        if (
          event.key === key &&
          (altKey === undefined || event.altKey === altKey) &&
          (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
          (shiftKey === undefined || event.shiftKey === shiftKey)
        ) {
          if (preventDefault) {
            event.preventDefault();
          }
          handler();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}
