import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui';
import { cn } from '../../ui/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  tooltip?: string;
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
  tooltip,
}: StatCardProps) {
  const changeColor =
    trend === 'up'
      ? 'text-status-success'
      : trend === 'down'
      ? 'text-status-error'
      : 'text-gray-600';

  const iconBgGradient =
    trend === 'up'
      ? 'from-status-success-light to-emerald-50'
      : trend === 'down'
      ? 'from-status-error-light to-red-50'
      : 'from-gold-50 to-gold-100/50';

  const iconColor =
    trend === 'up'
      ? 'text-status-success'
      : trend === 'down'
      ? 'text-status-error'
      : 'text-gold-600';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  const cardContent = (
    <Card 
      className={cn(
        'border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full',
        'bg-gradient-to-br from-white to-gray-50/50',
        'hover:scale-[1.02] hover:-translate-y-0.5',
        'group cursor-pointer',
        className
      )}
    >
      <CardContent className="p-6 h-full flex flex-col relative overflow-hidden">
        {/* Decorative background accent */}
        <div 
          className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 transition-opacity duration-300 group-hover:opacity-10',
            trend === 'up' ? 'bg-status-success' : trend === 'down' ? 'bg-status-error' : 'bg-primary'
          )}
          style={{ transform: 'translate(30%, -30%)' }}
        />
        
        <div className="flex items-start justify-between gap-4 flex-1 relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                {title}
              </p>
              {change && (
                <div className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                  trend === 'up' && 'bg-status-success-light text-status-success',
                  trend === 'down' && 'bg-status-error-light text-status-error',
                  trend === 'neutral' && 'bg-gray-100 text-gray-600'
                )}>
                  <TrendIcon className="w-3 h-3" />
                </div>
              )}
            </div>
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-2 tracking-tight">
              {value}
            </h3>
            {change && (
              <p className={cn('text-sm font-medium min-h-[20px] flex items-center gap-1.5', changeColor)}>
                {change}
              </p>
            )}
          </div>
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
              'bg-gradient-to-br shadow-lg transition-all duration-300',
              'group-hover:scale-110 group-hover:shadow-xl',
              iconBgGradient
            )}
          >
            <Icon
              className={cn('w-8 h-8 transition-transform duration-300 group-hover:scale-110', iconColor)}
            />
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div 
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 transition-all duration-300',
            trend === 'up' ? 'bg-status-success' : trend === 'down' ? 'bg-status-error' : 'bg-primary',
            'group-hover:h-1.5'
          )}
        />
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm font-medium">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

