import { Badge } from '../ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';

export interface ListItemData {
  id: string;
  title: string;
  subtitle?: string;
  metadata?: Array<{
    icon?: LucideIcon;
    label?: string;
    value: string;
    highlight?: boolean;
  }>;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'outline' | 'destructive';
    className?: string;
    style?: React.CSSProperties;
  }>;
  amount?: string | number;
  amountLabel?: string;
  actionButtons?: React.ReactNode;
}

interface ListItemProps {
  data: ListItemData;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  compact?: boolean;
}

export function ListItem({
  data,
  icon: Icon,
  iconBgColor = 'bg-gray-50',
  iconColor = 'text-gray-600',
  className,
  compact = false
}: ListItemProps) {
  const padding = compact ? 'p-2.5' : 'p-3';
  const iconSize = compact ? 'w-9 h-9' : 'w-10 h-10';
  const iconInnerSize = compact ? 'w-4 h-4' : 'w-5 h-5';
  const gap = compact ? 'gap-2.5' : 'gap-3';
  const titleSize = compact ? 'text-sm' : 'text-base';
  const metadataGap = compact ? 'gap-x-2.5 gap-y-1' : 'gap-x-3 gap-y-1.5';

  // Format amount - handle both string and number
  const formatAmount = (amount: string | number | undefined): string => {
    if (!amount) return '';
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    return amount.startsWith('$') ? amount : `$${amount}`;
  };

  return (
    <div className={cn(padding, 'bg-white', className)}>
      <div className={cn('flex items-start', gap)}>
        {/* Icon */}
        {Icon && (
          <div className={cn(iconSize, 'rounded-lg', iconBgColor, 'flex items-center justify-center flex-shrink-0')}>
            <Icon className={cn(iconInnerSize, iconColor)} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row: ID/Title and Badges */}
          <div className={cn('flex items-center', compact ? 'gap-1.5 mb-1' : 'gap-2 mb-1.5', 'flex-wrap')}>
            <h3 className={cn(titleSize, 'font-bold text-gray-900 tracking-tight')}>{data.id}</h3>
            {data.badges?.map((badge, idx) => (
              <Badge
                key={idx}
                variant={badge.variant || 'outline'}
                className={cn('text-xs px-1.5 py-0.5 leading-none font-medium', badge.className)}
                style={badge.style}
              >
                {badge.label}
              </Badge>
            ))}
          </div>

          {/* Title/Subtitle */}
          <h4 className={cn('text-gray-900 font-semibold mb-2 text-sm leading-snug')}>{data.title}</h4>
          {data.subtitle && (
            <p className="text-gray-600 text-xs mb-2 leading-relaxed">{data.subtitle}</p>
          )}

          {/* Metadata Grid */}
          {data.metadata && data.metadata.length > 0 && (
            <div className={cn('grid grid-cols-2 lg:grid-cols-4', metadataGap, 'text-xs')}>
              {data.metadata.map((meta, idx) => (
                <div key={idx} className="flex items-center gap-1.5 min-w-0">
                  {meta.icon && (
                    <meta.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  )}
                  {meta.label && (
                    <span className="text-gray-500">{meta.label}:</span>
                  )}
                  <span
                    className={cn(
                      'truncate',
                      meta.highlight ? 'text-gray-900 font-semibold' : 'text-gray-600'
                    )}
                    title={meta.value}
                  >
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount and Actions */}
        {(data.amount !== undefined || data.actionButtons) && (
          <div className="flex flex-col items-end gap-2 flex-shrink-0 self-start">
            {data.amount !== undefined && (
              <div className="text-right">
                <h3 className={cn('font-bold text-gray-900 leading-tight mb-0.5', compact ? 'text-sm' : 'text-base')}>
                  {formatAmount(data.amount)}
                </h3>
                {data.amountLabel && (
                  <p className="text-xs text-gray-500">{data.amountLabel}</p>
                )}
              </div>
            )}
            {data.actionButtons && (
              <div className="flex items-center gap-1.5">
                {data.actionButtons}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
