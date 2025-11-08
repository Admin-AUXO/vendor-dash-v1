import { cn } from '../ui/utils';

interface ChartSkeletonProps {
  className?: string;
  height?: number;
}

export function ChartSkeleton({ className, height = 240 }: ChartSkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-white border border-border rounded-lg p-6', className)}>
      <div className="pb-3 border-b border-gray-200 mb-4">
        <div className="h-5 bg-gray-300 rounded w-1/3" />
      </div>
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Simulated chart bars/lines */}
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-t"
              style={{
                width: '12%',
                height: `${20 + Math.random() * 70}%`,
              }}
            />
          ))}
        </div>
        {/* Axis lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />
        <div className="absolute bottom-0 left-0 top-0 w-px bg-gray-300" />
      </div>
    </div>
  );
}

