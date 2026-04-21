import { useRouteLoader } from '@/hooks/usePageLoader';

/**
 * Component that shows a loader during route transitions
 * Place this inside the Router to enable automatic page loading indicators
 */
export default function RouteLoader() {
  useRouteLoader();
  return null;
}

