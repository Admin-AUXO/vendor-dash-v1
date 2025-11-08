import React from 'react';
import { cn } from '../ui/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader Component
 * 
 * Consistent page header with title, description, and action buttons
 * 
 * @example
 * <PageHeader
 *   title="Work Orders"
 *   description="Manage and track all work orders"
 *   actions={<Button>Create</Button>}
 * />
 */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

