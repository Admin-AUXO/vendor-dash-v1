import { cn } from '../ui/utils';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles = {
  success: 'bg-status-success-light text-status-success border-status-success',
  warning: 'bg-status-warning-light text-status-warning border-status-warning',
  error: 'bg-status-error-light text-status-error border-status-error',
  info: 'bg-status-info-light text-status-info border-status-info',
  pending: 'bg-status-pending-light text-status-pending border-status-pending',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function StatusBadge({ status, label, className, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-medium min-w-[60px]',
        statusStyles[status],
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

