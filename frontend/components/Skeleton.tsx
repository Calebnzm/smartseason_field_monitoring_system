import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

interface SkeletonLineProps extends SkeletonProps {
  width?: string;
}

interface SkeletonCircleProps {
  size?: number;
  className?: string;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Generic skeleton loader
 */
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton line for text content
 */
export function SkeletonLine({ count = 1, width = 'w-full', className = '' }: SkeletonLineProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 ${width}`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton circle (for avatars, icons, etc)
 */
export function SkeletonCircle({ size = 40, className = '' }: SkeletonCircleProps) {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Skeleton card component
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg p-6 border border-var(--color-border) ${className}`}>
      <div className="space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton table component
 */
export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: SkeletonTableProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table header */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={`header-${idx}`} className="h-4" />
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton page loader (shows multiple cards)
 */
export function SkeletonPage({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Skeleton className="h-10 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
      <SkeletonCard />
    </div>
  );
}
