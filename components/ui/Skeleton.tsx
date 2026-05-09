import { cn } from '../../utils/cn';

interface SkeletonProps {
  variant?: 'text' | 'avatar' | 'card';
  className?: string;
  lines?: number;
}

export function Skeleton({ variant = 'text', className, lines = 1 }: SkeletonProps) {
  if (variant === 'avatar') {
    return (
      <div className={cn('w-9 h-9 rounded-full animate-shimmer', className)} />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl p-4 space-y-3 bg-bg-secondary border border-border', className)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full animate-shimmer" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded animate-shimmer" />
            <div className="h-3 w-48 rounded animate-shimmer" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded animate-shimmer" />
          <div className="h-3 w-3/4 rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded animate-shimmer"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function StackListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}
