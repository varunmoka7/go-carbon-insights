
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';

const SidebarTrigger: React.FC = () => {
  const { toggle, isMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="lg:hidden"
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default SidebarTrigger;
