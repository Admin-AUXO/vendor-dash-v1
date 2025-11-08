import { format } from 'date-fns';
import { MapPin, Calendar, Wrench } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { TruncatedText } from './TruncatedText';
import { cn } from '../ui/utils';
import type { WorkOrder } from '../../data/types';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: () => void;
  className?: string;
}

/**
 * WorkOrderCard Component
 * 
 * A dedicated component for displaying work order information in a clean, organized card format.
 * Follows best practices with proper spacing, visual hierarchy, and information grouping.
 * 
 * @example
 * <WorkOrderCard
 *   workOrder={workOrder}
 *   onClick={() => handleClick(workOrder.id)}
 * />
 */
export function WorkOrderCard({ workOrder, onClick, className }: WorkOrderCardProps) {
  const statusType = 
    workOrder.status === 'completed' ? 'success' :
    workOrder.status === 'in-progress' ? 'info' :
    workOrder.status === 'cancelled' ? 'error' :
    'pending';

  const statusLabel = workOrder.status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-4 bg-white border border-border rounded-lg',
        'hover:shadow-md hover:border-gray-300 transition-all duration-200',
        'cursor-pointer',
        className
      )}
    >
      {/* Header Row - ID and Badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {workOrder.workOrderId}
          </h3>
          <PriorityBadge priority={workOrder.priority} size="sm" />
          <StatusBadge status={statusType} label={statusLabel} size="sm" />
        </div>
      </div>

      {/* Address Row */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <TruncatedText 
          text={workOrder.propertyAddress}
          maxLength={60}
          className="text-sm text-gray-700 flex-1"
        />
      </div>

      {/* Service Description Row */}
      <div className="flex items-start gap-2 mb-3">
        <Wrench className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-1 flex-1">
          {workOrder.serviceDescription}
        </p>
      </div>

      {/* Footer Row - Due Date */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-500">
          Due: {format(new Date(workOrder.dueDate), 'MMM dd, yyyy')}
        </span>
      </div>
    </div>
  );
}

