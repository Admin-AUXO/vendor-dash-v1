import { useState } from 'react';
import { MapPin, Wrench, Clock, Tag, User, Phone, Mail, Calendar, FileText, ChevronDown, ChevronUp, Building2, Users } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { format } from 'date-fns';
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate time elapsed
  const getTimeElapsed = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

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
      className={cn(
        'group relative bg-white border border-gray-200 rounded-lg',
        'hover:shadow-lg hover:border-gray-300 transition-all duration-200',
        'overflow-hidden',
        className
      )}
    >
      {/* Main Card Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Left Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-sm">
          <Wrench className="w-6 h-6 text-yellow-700" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
      {/* Header Row - ID and Badges */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
              <h3 className="font-bold text-base text-gray-900">
            {workOrder.workOrderId}
          </h3>
          <PriorityBadge priority={workOrder.priority} size="sm" />
          <StatusBadge status={statusType} label={statusLabel} size="sm" />
          <CategoryBadge category={workOrder.serviceCategory} size="sm" />
            </div>
          </div>

          {/* Service Description */}
          <p className="text-sm text-gray-800 font-semibold mb-3">
            {workOrder.serviceDescription}
          </p>

          {/* Summary Info - Only Essential Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{workOrder.propertyAddress.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span>Requested {getTimeElapsed(new Date(workOrder.requestDate))}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-semibold text-gray-700">${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            {workOrder.assignedTechnician && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{workOrder.assignedTechnician}</span>
              </div>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            variant="default"
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold border-yellow-600 hover:border-yellow-700/30 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <span>Hide Details</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>View Details</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out">
          <div className="p-5 space-y-5">
            {/* Top Section: Client & Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Client Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{workOrder.clientName}</span>
                  </div>
                  {workOrder.clientContact && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">{workOrder.clientContact}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${workOrder.clientPhone}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                      {workOrder.clientPhone}
                    </a>
                  </div>
                  {workOrder.clientEmail && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${workOrder.clientEmail}`} className="text-blue-600 hover:text-blue-700 hover:underline truncate">
                        {workOrder.clientEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Property Details</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{workOrder.propertyAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 capitalize">{workOrder.propertyType.replace('-', ' ')} Property</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Timeline & Cost - Better Grouped */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              {/* Timeline Section: Dates & Assignment Combined */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline & Assignment</h4>
                <div className="space-y-4">
                  {/* Important Dates */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Requested</div>
                        <div className="text-gray-700 font-medium">{format(new Date(workOrder.requestDate), 'MMM dd, yyyy')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Due</div>
                        <div className="text-gray-700 font-medium">{format(new Date(workOrder.dueDate), 'MMM dd, yyyy')}</div>
                      </div>
                    </div>
                    {workOrder.completedDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-0.5">Completed</div>
                          <div className="text-gray-700 font-medium">{format(new Date(workOrder.completedDate), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assignment Details */}
                  {(workOrder.assignedTeam || workOrder.estimatedHours || workOrder.actualHours) && (
                    <div className="pt-3 border-t border-gray-100 space-y-2.5">
                      {workOrder.assignedTeam && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">Team: {workOrder.assignedTeam}</span>
                        </div>
                      )}
                      {workOrder.estimatedHours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-0.5">Estimated Hours</div>
                            <div className="text-gray-700 font-medium">{workOrder.estimatedHours} hours</div>
                          </div>
                        </div>
                      )}
                      {workOrder.actualHours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-500 mb-0.5">Actual Hours</div>
                            <div className="text-gray-700 font-medium">
                              {workOrder.actualHours} hours
                              {workOrder.estimatedHours && (
                                <span className={`ml-2 text-xs font-normal ${workOrder.actualHours > workOrder.estimatedHours ? 'text-red-600' : workOrder.actualHours < workOrder.estimatedHours ? 'text-green-600' : 'text-gray-500'}`}>
                                  ({workOrder.actualHours > workOrder.estimatedHours ? '+' : ''}{workOrder.actualHours - workOrder.estimatedHours}h)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Information Column */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cost Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-0.5">Estimated Cost</div>
                      <div className="text-gray-700 font-medium">${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                  {workOrder.actualCost && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-0.5">Actual Cost</div>
                        <div className="text-gray-700 font-medium">
                          ${workOrder.actualCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {workOrder.estimatedCost && (
                            <span className={`ml-2 text-xs font-normal ${workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600' : workOrder.actualCost < workOrder.estimatedCost ? 'text-green-600' : 'text-gray-500'}`}>
                              ({workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}${(workOrder.actualCost - workOrder.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {workOrder.notes && (
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h4>
                <div className="flex items-start gap-2.5 text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="flex-1 leading-relaxed">{workOrder.notes}</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-3 border-t border-gray-200">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                variant="default"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-md hover:shadow-lg border-gray-900 hover:border-gray-800/20"
              >
                Open Work Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

