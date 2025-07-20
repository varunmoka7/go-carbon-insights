import { useEffect, useRef, useCallback, useState, useMemo } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom in pixels to trigger load
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

interface UseInfiniteScrollReturn {
  sentinelRef: React.RefObject<HTMLDivElement>;
  showBackToTop: boolean;
  scrollToTop: () => void;
}

export const useInfiniteScroll = ({
  threshold = 200,
  onLoadMore,
  hasMore,
  loading,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: `0px 0px ${threshold}px 0px`,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [threshold, onLoadMore, hasMore, loading]);

  // Scroll listener for back-to-top button with simplified throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeoutId) return; // Skip if already scheduled
      
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        setShowBackToTop(scrollY > 400);
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return {
    sentinelRef,
    showBackToTop,
    scrollToTop,
  };
};