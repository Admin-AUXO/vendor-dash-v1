import { cn } from '../ui/utils';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles = {
  success: 'bg-status-success-light text-status-success border-status-success/40 hover:bg-status-success/15 hover:border-status-success/60',
  warning: 'bg-status-warning-light text-status-warning border-status-warning/40 hover:bg-status-warning/15 hover:border-status-warning/60',
  error: 'bg-status-error-light text-status-error border-status-error/40 hover:bg-status-error/15 hover:border-status-error/60',
  info: 'bg-status-info-light text-status-info border-status-info/40 hover:bg-status-info/15 hover:border-status-info/60',
  pending: 'bg-status-pending-light text-status-pending border-status-pending/40 hover:bg-status-pending/15 hover:border-status-pending/60',
};

const sizeStyles = {
  sm: 'px-2.5 py-0.5 text-[11px] leading-tight tracking-tight min-h-[20px]',
  md: 'px-3 py-1 text-xs leading-tight tracking-tight min-h-[24px]',
  lg: 'px-3.5 py-1.5 text-sm leading-tight tracking-tight min-h-[28px]',
};

export function StatusBadge({ status, label, className, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-semibold w-[110px] whitespace-nowrap shadow-sm transition-all duration-200 antialiased',
        'hover:shadow-md hover:scale-105 active:scale-100 cursor-default select-none',
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

