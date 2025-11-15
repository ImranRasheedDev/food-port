import { useState, useEffect, useRef, useCallback } from 'react';
import { useBannerAds } from './api';

export const useLazyAds = (initialLimit = 3) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allAds, setAllAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);
  const containerRef = useRef(null);

  // Use the existing API hook with pagination
  const { data: adsData, isLoading: initialLoading, error } = useBannerAds({
    page: currentPage,
    limit: initialLimit
  });

  // Update all ads when new data comes
  useEffect(() => {
    if (adsData?.data) {
      // Filter out ads where product is null
      const filteredAds = adsData.data.filter(item => item.product !== null);
      
      if (currentPage === 1) {
        setAllAds(filteredAds);
      } else {
        setAllAds(prev => [...prev, ...filteredAds]);
      }
      
      // Check if there are more ads to load
      setHasMore(adsData.data.length === initialLimit);
    }
  }, [adsData, currentPage, initialLimit]);

  // Load more ads
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setCurrentPage(prev => prev + 1);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore]);

  // Window scroll-based loading with throttling
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      // Throttle scroll events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Load more when user scrolls to 70% of the page
        if (scrollTop + windowHeight >= documentHeight * 0.7) {
          loadMore();
        }
      }, 100); // Throttle to 100ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loadMore, isLoading, hasMore]);

  // Intersection Observer for initial load
  useEffect(() => {
    if (!loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(loadingRef.current);

    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore]);

  return {
    ads: allAds,
    isLoading: initialLoading || isLoading,
    hasMore,
    error,
    containerRef,
    loadingRef,
    loadMore
  };
};
