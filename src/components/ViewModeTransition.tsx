import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewModeContext } from '@/contexts/ViewModeContext';

interface ViewModeTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const ViewModeTransition: React.FC<ViewModeTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isTransitioning } = useViewModeContext();

  const transitionVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isTransitioning ? 'transitioning' : 'stable'}
        variants={transitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`view-mode-transition ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Loading overlay for transitions
export const ViewModeLoadingOverlay: React.FC = () => {
  const { isTransitioning } = useViewModeContext();

  if (!isTransitioning) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Switching view mode...</p>
      </div>
    </motion.div>
  );
};