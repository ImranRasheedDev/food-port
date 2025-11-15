import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoader } from '@/contexts/LoaderContext';

/**
 * Hook to automatically show loader during route transitions
 */
export function useRouteLoader() {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // Show loader when route changes
    showLoader('Loading page...');
    
    // Hide loader after a short delay (simulating page load)
    const timer = setTimeout(() => {
      hideLoader();
    }, 500);

    return () => {
      clearTimeout(timer);
      hideLoader();
    };
  }, [location.pathname]);
}

/**
 * Hook to manually control loader
 * @param {boolean} isLoading - Whether to show the loader
 * @param {string} message - Custom loading message
 */
export function usePageLoader(isLoading, message = 'Loading...') {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader(message);
    } else {
      hideLoader();
    }

    return () => {
      hideLoader();
    };
  }, [isLoading, message]);
}

export default usePageLoader;

