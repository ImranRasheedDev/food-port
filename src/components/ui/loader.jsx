import React from 'react';
import { cn } from '@/lib/utils';

// Spinner Component
export function Spinner({ className, size = 'default' }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-50 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}

// Full Page Loader
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="large" />
        {message && (
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Inline Loader (for sections within a page)
export function InlineLoader({ message = 'Loading...', className }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="flex flex-col items-center gap-3">
        <Spinner />
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

// Overlay Loader (semi-transparent overlay over content)
export function OverlayLoader({ message = 'Loading...' }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="large" />
        {message && (
          <p className="text-base font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Spinner;

