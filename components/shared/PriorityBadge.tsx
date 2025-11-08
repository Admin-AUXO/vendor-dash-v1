import { cn } from '../ui/utils';

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const priorityStyles = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-gold-100 text-gold-700 border-gold-200',
  low: 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityLabels = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function PriorityBadge({ priority, label, className, size = 'md' }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-medium min-w-[60px]',
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

