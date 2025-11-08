import { cn } from '../../ui/utils';
import type { ServiceCategory } from '../../../data/types';

interface CategoryBadgeProps {
  category: ServiceCategory | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const categoryStyles: Record<string, string> = {
  plumbing: 'bg-blue-50 text-blue-700 border-blue-200/60 hover:bg-blue-100/80 hover:border-blue-300/80',
  hvac: 'bg-cyan-50 text-cyan-700 border-cyan-200/60 hover:bg-cyan-100/80 hover:border-cyan-300/80',
  electrical: 'bg-yellow-50 text-yellow-800 border-yellow-300/60 hover:bg-yellow-100/80 hover:border-yellow-400/80',
  carpentry: 'bg-amber-50 text-amber-800 border-amber-300/60 hover:bg-amber-100/80 hover:border-amber-400/80',
  painting: 'bg-purple-50 text-purple-700 border-purple-200/60 hover:bg-purple-100/80 hover:border-purple-300/80',
  landscaping: 'bg-green-50 text-green-700 border-green-200/60 hover:bg-green-100/80 hover:border-green-300/80',
  appliance: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100/80 hover:border-indigo-300/80',
  general: 'bg-gray-50 text-gray-700 border-gray-200/60 hover:bg-gray-100/80 hover:border-gray-300/80',
};

const sizeStyles = {
  sm: 'px-2.5 py-0.5 text-[11px] leading-tight tracking-tight min-h-[20px]',
  md: 'px-3 py-1 text-xs leading-tight tracking-tight min-h-[22px]',
  lg: 'px-3.5 py-1.5 text-sm leading-tight tracking-tight min-h-[24px]',
};

const formatCategoryLabel = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function CategoryBadge({ category, className, size = 'md' }: CategoryBadgeProps) {
  const categoryKey = category.toLowerCase();
  const style = categoryStyles[categoryKey] || categoryStyles.general;
  
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-semibold shadow-sm transition-all duration-200 antialiased',
        'hover:shadow-md hover:scale-105 active:scale-100 cursor-default select-none capitalize',
        style,
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label={`Category: ${formatCategoryLabel(category)}`}
    >
      {formatCategoryLabel(category)}
    </span>
  );
}

