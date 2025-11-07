import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

/**
 * StatCard Component
 * 
 * Displays key performance indicators with icons and trend indicators
 * 
 * @example
 * <StatCard
 *   title="Active Work Orders"
 *   value={24}
 *   change="+3 new today"
 *   trend="up"
 *   icon={ClipboardList}
 * />
 */
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
}: StatCardProps) {
  const changeColor =
    trend === 'up'
      ? 'text-green-600'
      : trend === 'down'
      ? 'text-red-600'
      : 'text-gray-600';

  return (
    <Card className={cn('border-0 shadow-md hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{value}</h3>
            {change && (
              <p className={cn('text-xs font-medium', changeColor)}>{change}</p>
            )}
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--gold-50)' }}
          >
            <Icon
              className="w-7 h-7"
              style={{ color: 'var(--gold-600)' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

