import { LucideIcon, Search, Inbox, FileX, AlertCircle } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

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

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)} role="status" aria-live="polite">
      {DisplayIcon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4" aria-hidden="true">
          <DisplayIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 max-w-sm mb-4" style={{ lineHeight: '1.5' }}>
          {description}
        </p>
      )}
      {defaultSuggestions.length > 0 && (
        <ul className="text-sm text-gray-500 max-w-md mb-6 space-y-1" role="list">
          {defaultSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start justify-center gap-2">
              <span className="text-gray-400" aria-hidden="true">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
      {action && (
        <Button 
          onClick={action.onClick} 
          variant="default"
          className="min-h-[44px]"
          aria-label={action.label}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

