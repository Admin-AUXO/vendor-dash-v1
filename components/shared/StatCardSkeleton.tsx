import { cn } from '../ui/utils';

interface StatCardSkeletonProps {
  className?: string;
}

export function StatCardSkeleton({ className }: StatCardSkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-white border border-border rounded-lg p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

