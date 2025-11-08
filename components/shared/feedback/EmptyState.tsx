import { LucideIcon, Search, Inbox, FileX, AlertCircle } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  suggestions?: string[];
  className?: string;
  variant?: 'default' | 'no-results' | 'empty' | 'error';
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  suggestions,
  className,
  variant = 'default'
}: EmptyStateProps) {
  // Auto-select icon based on variant if not provided
  const DisplayIcon = Icon || (variant === 'no-results' ? Search :
                              variant === 'empty' ? Inbox :
                              variant === 'error' ? AlertCircle :
                              FileX);

  // Auto-generate suggestions based on variant if not provided
  const defaultSuggestions = suggestions || (variant === 'no-results' ? [
    'Try adjusting your search terms',
    'Clear some filters to see more results',
    'Check your spelling'
  ] : variant === 'empty' ? [
    'Get started by creating your first item',
    'Import data from an existing source',
    'Invite team members to collaborate'
  ] : []);

  const iconBgColor = variant === 'error' 
    ? 'bg-status-error-light' 
    : variant === 'no-results'
    ? 'bg-primary/10'
    : variant === 'empty'
    ? 'bg-blue-50'
    : 'bg-gray-100';

  const iconColor = variant === 'error'
    ? 'text-status-error'
    : variant === 'no-results'
    ? 'text-primary'
    : variant === 'empty'
    ? 'text-blue-600'
    : 'text-gray-400';

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)} role="status" aria-live="polite">
      {DisplayIcon && (
        <div 
          className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 hover:scale-105',
            iconBgColor
          )} 
          aria-hidden="true"
        >
          <DisplayIcon className={cn('w-10 h-10', iconColor)} />
        </div>
      )}
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 max-w-md mb-6 font-medium leading-relaxed">
          {description}
        </p>
      )}
      {defaultSuggestions.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <ul className="text-sm text-gray-500 space-y-2" role="list">
            {defaultSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start justify-start gap-2.5 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-primary mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
                <span className="text-left font-medium">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {action && (
        <Button 
          onClick={action.onClick} 
          variant="default"
          className="min-h-[44px] px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          aria-label={action.label}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

