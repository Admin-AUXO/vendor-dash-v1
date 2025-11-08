import { cn } from '../ui/utils';

interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  height?: string;
}

export function CardSkeleton({ className, showHeader = true, height }: CardSkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-white border border-border rounded-lg p-6', className)} style={height ? { height } : undefined}>
      {showHeader && (
        <div className="pb-3 border-b border-gray-200 mb-4">
          <div className="h-5 bg-gray-300 rounded w-1/3" />
        </div>
      )}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

