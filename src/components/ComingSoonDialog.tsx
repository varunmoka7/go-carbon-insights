
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonDialog: React.FC<ComingSoonDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Coming Soon</DialogTitle>
          <DialogDescription>
            This feature is not yet available in demo mode.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonDialog;
