// src/components/ui/skeleton/Skeleton.jsx
import React from "react";
import { Slot } from "@radix-ui/react-slot";

export function Skeleton({
  asChild = false,
  className = "",
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={`bg-slate-200 rounded ${className} animate-pulse`}
      aria-hidden="true"
      {...props}
    >
      {children}
    </Comp>
  );
}

/* A small card-shaped skeleton you can reuse everywhere */
export function SkeletonCard({ className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-lg bg-white shadow-sm p-4 ${className}`}
    >
      {/* image area */}
      <Skeleton className="w-full h-44 rounded-md" />

      {/* text lines */}
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 rounded w-3/4" />
        <Skeleton className="h-3 rounded w-1/2" />
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

/* A tiny helper if you want repeated small lines */
export function SkeletonText({ lines = 2, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 rounded w-full" />
      ))}
    </div>
  );
}

export default Skeleton;
