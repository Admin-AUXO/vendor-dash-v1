import { Badge } from '../ui/badge';
import { MapPin, User, Calendar, Wrench, Clock, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface WorkOrderListItemData {
  id: string;
  property: string;
  client: string;
  issue: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  estimatedCost: string;
  created: string;
  assignedTo?: string;
  dueDate?: string;
  completion?: number;
}

interface WorkOrderListItemProps {
  order: WorkOrderListItemData;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  statusBadge?: React.ReactNode;
  actionButton?: React.ReactNode;
  onExpand?: () => void;
  getPriorityColor: (priority: string) => string;
  getPriorityStyle: (priority: string) => React.CSSProperties;
}

export function WorkOrderListItem({
  order,
  icon: Icon = Wrench,
  iconBgColor = 'bg-purple-50',
  iconColor = 'text-purple-600',
  statusBadge,
  actionButton,
  getPriorityColor,
  getPriorityStyle
}: WorkOrderListItemProps) {
  // Format amount - remove duplicate $ if present
  const formatAmount = (amount: string): string => {
    // If amount already starts with $, return as is, otherwise add $
    return amount.startsWith('$') ? amount : `$${amount}`;
  };

  return (
    <div className="p-3 bg-white">
      <div className="flex items-start gap-3">
        {/* Icon - Smaller */}
        <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row: ID and Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-base font-bold text-gray-900 tracking-tight">{order.id}</h3>
            <Badge 
              className={`text-xs border px-1.5 py-0.5 leading-none font-medium ${getPriorityColor(order.priority)}`}
              style={getPriorityStyle(order.priority)}
            >
              {order.priority}
            </Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 leading-none font-medium bg-gray-50">
              {order.category}
            </Badge>
            {statusBadge}
          </div>

          {/* Title */}
          <h4 className="text-gray-900 font-semibold mb-2 text-sm leading-snug">{order.issue}</h4>

          {/* Metadata Grid - Aligned columns, tighter spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-1.5 text-xs">
            {/* Location */}
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 truncate" title={order.property}>{order.property}</span>
            </div>

            {/* Client */}
            <div className="flex items-center gap-1.5 min-w-0">
              <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 truncate" title={order.client}>{order.client}</span>
            </div>

            {/* Cost - No dollar icon, just the amount */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-gray-600 font-medium">{formatAmount(order.estimatedCost)}</span>
            </div>

            {/* Date - Highlighted */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-semibold">{order.created}</span>
            </div>

            {/* Optional: Assigned To */}
            {order.assignedTo && (
              <div className="flex items-center gap-1.5 min-w-0">
                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">Assigned: {order.assignedTo}</span>
              </div>
            )}

            {/* Optional: Due Date */}
            {order.dueDate && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">Due: {order.dueDate}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {order.completion !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-gray-600 font-medium">Progress</span>
                <span className="text-xs font-semibold text-gray-900">{order.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${order.completion}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {actionButton && (
          <div className="flex-shrink-0 self-start">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
