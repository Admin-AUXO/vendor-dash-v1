import React from 'react';
import { format } from 'date-fns';
import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: LucideIcon;
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusColors = {
  success: 'bg-green-500 border-green-500',
  warning: 'bg-orange-500 border-orange-500',
  error: 'bg-red-500 border-red-500',
  info: 'bg-blue-500 border-blue-500',
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {items.map((item, index) => {
          const timestamp = typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp;
          const Icon = item.icon;
          const statusColor = item.status ? statusColors[item.status] : 'bg-gray-400 border-gray-400';

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Icon/Dot */}
              <div className="relative z-10 flex items-center justify-center">
                {Icon ? (
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white',
                      statusColor
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full border-2 bg-white',
                      statusColor
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  <time className="text-xs text-gray-500 whitespace-nowrap">
                    {format(timestamp, 'MMM dd, yyyy HH:mm')}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

