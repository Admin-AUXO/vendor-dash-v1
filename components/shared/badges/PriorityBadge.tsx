import { cn } from '../../ui/utils';

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const priorityStyles = {
  urgent: 'bg-red-100 text-red-800 border-red-300/60 hover:bg-red-200/80 hover:border-red-400/80 shadow-sm',
  high: 'bg-orange-100 text-orange-800 border-orange-300/60 hover:bg-orange-200/80 hover:border-orange-400/80 shadow-sm',
  medium: 'bg-gold-100 text-gold-800 border-gold-300/60 hover:bg-gold-200/80 hover:border-gold-400/80 shadow-sm',
  low: 'bg-gray-100 text-gray-700 border-gray-300/60 hover:bg-gray-200/80 hover:border-gray-400/80 shadow-sm',
};

const priorityLabels = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const sizeStyles = {
  sm: 'px-2.5 py-0.5 text-[11px] leading-tight tracking-tight min-h-[20px] min-w-[50px]',
  md: 'px-3 py-1 text-xs leading-tight tracking-tight min-h-[24px] min-w-[60px]',
  lg: 'px-3.5 py-1.5 text-sm leading-tight tracking-tight min-h-[28px] min-w-[70px]',
};

export function PriorityBadge({ priority, label, className, size = 'md' }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-semibold shadow-sm transition-all duration-300 antialiased',
        'hover:shadow-md hover:scale-105 active:scale-100 cursor-default select-none',
        priorityStyles[priority],
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label={`Priority: ${label || priorityLabels[priority]}`}
    >
      {label || priorityLabels[priority]}
    </span>
  );
}

