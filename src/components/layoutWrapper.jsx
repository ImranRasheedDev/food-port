import { cn } from '@/lib/utils'
import React from 'react'

const LayoutWrapper = ({ children, className }) => {
  return (
    <div className={cn("max-w-[1280px] mx-auto px-4", className)}>
      {children}
    </div>
  );
};

export default LayoutWrapper;