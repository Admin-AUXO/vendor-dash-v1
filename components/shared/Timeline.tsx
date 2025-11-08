import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { cn } from '../ui/utils';
import { LucideIcon, CheckCircle2, AlertCircle, Info, Clock, Wallet, ClipboardCheck, MessageSquare, Briefcase, Receipt } from 'lucide-react';

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

const statusConfig = {
  success: { 
    bg: 'bg-status-success-light', 
    iconBg: 'bg-status-success', 
    border: 'border-status-success/30',
    icon: CheckCircle2,
    text: 'text-status-success'
  },
  warning: { 
    bg: 'bg-status-warning-light', 
    iconBg: 'bg-status-warning', 
    border: 'border-status-warning/30',
    icon: AlertCircle,
    text: 'text-status-warning'
  },
  error: { 
    bg: 'bg-status-error-light', 
    iconBg: 'bg-status-error', 
    border: 'border-status-error/30',
    icon: AlertCircle,
    text: 'text-status-error'
  },
  info: { 
    bg: 'bg-status-info-light', 
    iconBg: 'bg-status-info', 
    border: 'border-status-info/30',
    icon: Info,
    text: 'text-status-info'
  },
};

const getDefaultIcon = (title: string): LucideIcon => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('work order') || titleLower.includes('order')) return ClipboardCheck;
  if (titleLower.includes('invoice')) return Receipt;
  if (titleLower.includes('payment') || titleLower.includes('paid')) return Wallet;
  if (titleLower.includes('bid')) return Briefcase;
  if (titleLower.includes('ticket') || titleLower.includes('support')) return MessageSquare;
  return Clock;
};

const formatTimestamp = (timestamp: Date): string => {
  if (isToday(timestamp)) {
    return format(timestamp, 'HH:mm');
  }
  if (isYesterday(timestamp)) {
    return 'Yesterday';
  }
  return format(timestamp, 'MMM dd');
};

const formatRelativeTime = (timestamp: Date): string => {
  const distance = formatDistanceToNow(timestamp, { addSuffix: true });
  return distance.replace('about ', '').replace('less than ', '< ');
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent" />

      <div className="space-y-3">
        {items.map((item) => {
          const timestamp = typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp;
          const statusConfigItem = item.status 
            ? statusConfig[item.status] 
            : statusConfig.info;
          
          const Icon = item.icon || getDefaultIcon(item.title);
          const StatusIcon = statusConfigItem.icon;

          return (
            <div 
              key={item.id} 
              className={cn(
                'relative flex items-start gap-3 group',
                'hover:bg-gray-50/50 rounded-lg p-2 -ml-2 transition-colors duration-200'
              )}
            >
              {/* Icon */}
              <div className="relative z-10 flex items-center justify-center flex-shrink-0">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg border-2 flex items-center justify-center shadow-sm',
                    'transition-transform duration-200 group-hover:scale-110 group-hover:shadow-md',
                    statusConfigItem.iconBg,
                    statusConfigItem.border
                  )}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                {/* Status indicator dot */}
                <div className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                  statusConfigItem.iconBg,
                  'shadow-sm'
                )}>
                  <StatusIcon className="w-1.5 h-1.5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      'text-sm font-semibold text-gray-900 leading-tight',
                      'group-hover:text-gray-950 transition-colors'
                    )}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={cn(
                        'text-xs font-medium',
                        statusConfigItem.text
                      )}>
                        {formatRelativeTime(timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
                      {formatTimestamp(timestamp)}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                      {format(timestamp, 'yyyy') !== format(new Date(), 'yyyy') && format(timestamp, 'yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

