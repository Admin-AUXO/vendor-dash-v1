import { useState } from 'react';
import { MapPin, Wrench, Clock, Tag, User, Calendar, Building2, ChevronDown, ChevronUp, FileText, Edit, Plus, Paperclip } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { format } from 'date-fns';
import type { WorkOrder } from '../../data/types';

interface InboxWorkOrderCardProps {
  workOrder: WorkOrder;
  onViewDetails?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

/**
 * InboxWorkOrderCard Component
 * 
 * A specialized card component for the Inbox section with improved layout,
 * more details, and action buttons with expandable details section.
 */
export function InboxWorkOrderCard({ 
  workOrder, 
  onViewDetails, 
  onAction,
  actionLabel,
  actionVariant = 'default',
  className 
}: InboxWorkOrderCardProps) {
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

  // Format due date
  const dueDate = format(new Date(workOrder.dueDate), 'MMM dd, yyyy');
  const isOverdue = new Date(workOrder.dueDate) < new Date() && workOrder.status !== 'completed';

  return (
    <div
      className={cn(
        'group relative bg-white border border-gray-200 rounded-xl shadow-sm',
        'hover:shadow-md hover:border-primary/30 transition-all duration-300',
        'overflow-hidden border-l-4',
        isOverdue ? 'border-l-status-error' :
        workOrder.priority === 'urgent' ? 'border-l-priority-urgent' :
        workOrder.priority === 'high' ? 'border-l-priority-high' :
        statusType === 'success' ? 'border-l-status-success' :
        statusType === 'info' ? 'border-l-status-info' :
        statusType === 'pending' ? 'border-l-status-pending' :
        'border-l-primary',
        className
      )}
    >
      {/* Main Card Content */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Left Icon */}
          <div className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm',
            'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
            isOverdue ? 'bg-gradient-to-br from-status-error-light to-red-50' :
            statusType === 'success' ? 'bg-gradient-to-br from-status-success-light to-emerald-50' :
            statusType === 'error' ? 'bg-gradient-to-br from-status-error-light to-red-50' :
            statusType === 'info' ? 'bg-gradient-to-br from-status-info-light to-blue-50' :
            statusType === 'pending' ? 'bg-gradient-to-br from-status-pending-light to-yellow-50' :
            workOrder.priority === 'urgent' ? 'bg-gradient-to-br from-red-50 to-red-100/50' :
            workOrder.priority === 'high' ? 'bg-gradient-to-br from-orange-50 to-orange-100/50' :
            'bg-gradient-to-br from-primary/20 to-primary/10'
          )}>
            <Wrench className={cn(
              'w-7 h-7 transition-colors duration-300',
              isOverdue ? 'text-status-error' :
              statusType === 'success' ? 'text-status-success' :
              statusType === 'error' ? 'text-status-error' :
              statusType === 'info' ? 'text-status-info' :
              statusType === 'pending' ? 'text-status-pending' :
              workOrder.priority === 'urgent' ? 'text-priority-urgent' :
              workOrder.priority === 'high' ? 'text-priority-high' :
              'text-primary'
            )} />
          </div>

          {/* Content Section - Takes more space */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header Row - ID, Description (vertically centered), and Badges (left-aligned) */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Work Order ID and Description - vertically centered */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 font-mono flex-shrink-0">
                  {workOrder.workOrderId}
                </h3>
                <div className="h-4 w-px bg-gray-300 flex-shrink-0"></div>
                <p className="text-sm text-gray-900 font-semibold truncate">
                  {workOrder.serviceDescription}
                </p>
              </div>
              {/* Badges - left-aligned next to description */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={workOrder.priority} size="sm" />
                <StatusBadge status={statusType} label={statusLabel} size="sm" />
                <CategoryBadge category={workOrder.serviceCategory} size="sm" />
              </div>
            </div>

            {/* Details Grid - 2 rows x 3 columns for 6 data fields */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {/* Row 1, Column 1: Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate" title={workOrder.propertyAddress}>
                  {workOrder.propertyAddress.split(',')[0]}
                </span>
              </div>

              {/* Row 1, Column 2: Client */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Building2 className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate" title={workOrder.clientName}>
                  {workOrder.clientName}
                </span>
              </div>

              {/* Row 1, Column 3: Amount */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Tag className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900 truncate">
                  ${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Row 2, Column 1: Assigned Technician */}
              {workOrder.assignedTechnician ? (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                  <span className="truncate">{workOrder.assignedTechnician}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <User className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  <span className="truncate">Unassigned</span>
                </div>
              )}

              {/* Row 2, Column 2: Requested Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className="truncate">Requested {getTimeElapsed(new Date(workOrder.requestDate))}</span>
              </div>

              {/* Row 2, Column 3: Due Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                <span className={cn('truncate', isOverdue && 'text-red-600 font-semibold')}>
                  Due: {dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Section - Right Side */}
          <div className="flex-shrink-0 flex flex-col gap-2.5 items-stretch justify-start min-w-[140px]">
            {/* View Details Button - Toggles Expansion */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
                if (!isExpanded && onViewDetails) {
                  onViewDetails();
                }
              }}
              variant="default"
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold border-yellow-600 hover:border-yellow-700/30 shadow-sm hover:shadow-md w-full transition-all duration-300"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-1.5 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1.5 transition-transform duration-300" />
              )}
            </Button>

            {/* Action Button (Move to In Progress, Reject, Archive) */}
            {onAction && actionLabel && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.();
                }}
                variant={actionVariant}
                size="sm"
                className={cn(
                  'w-full font-semibold shadow-sm hover:shadow-md transition-all duration-300',
                  actionLabel.toLowerCase().includes('archive')
                    ? 'bg-gray-500 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-700/30'
                    : actionVariant === 'default' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 hover:border-blue-800/30'
                      : actionVariant === 'destructive'
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 hover:border-red-800/30'
                        : ''
                )}
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out">
          <div className="p-5">
            {/* Improved Multi-Column Layout with Better Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Column 1: Client Information */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300">
                  <Building2 className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-xs font-display font-semibold text-gray-900 uppercase tracking-wide">Client</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Name</div>
                    <div className="text-sm text-gray-900 font-semibold">{workOrder.clientName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Client ID</div>
                    <div className="text-sm text-gray-900 font-mono font-semibold">{workOrder.clientId?.toUpperCase() || workOrder.clientId}</div>
                  </div>
                  {workOrder.clientContact && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Contact</div>
                      <div className="text-sm text-gray-900 font-semibold">{workOrder.clientContact}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Phone</div>
                    <a href={`tel:${workOrder.clientPhone}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-semibold">
                      {workOrder.clientPhone}
                    </a>
                  </div>
                  {workOrder.clientEmail && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Email</div>
                      <a href={`mailto:${workOrder.clientEmail}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block font-semibold">
                        {workOrder.clientEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Property & Service Details */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300">
                  <MapPin className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Property & Service</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Address</div>
                    <div className="text-sm text-gray-900 font-semibold leading-snug">{workOrder.propertyAddress}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Type</div>
                    <div className="text-sm text-gray-900 font-semibold capitalize">{workOrder.propertyType.replace('-', ' ')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Category</div>
                    <div className="text-sm text-gray-900 capitalize font-semibold">{workOrder.serviceCategory}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Description</div>
                    <div className="text-sm text-gray-900 font-semibold leading-snug">{workOrder.serviceDescription}</div>
                  </div>
                </div>
              </div>

              {/* Column 3: Timeline & Assignment */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Timeline</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Requested</div>
                    <div className="text-sm text-gray-900 font-semibold">{format(new Date(workOrder.requestDate), 'MMM dd, yyyy')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Due</div>
                    <div className={cn("text-sm font-semibold", isOverdue ? "text-red-600" : "text-gray-900")}>
                      {format(new Date(workOrder.dueDate), 'MMM dd, yyyy')}
                      {isOverdue && <span className="ml-1.5 text-xs font-normal">(Overdue)</span>}
                    </div>
                  </div>
                  {workOrder.completedDate && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Completed</div>
                      <div className="text-sm text-gray-900 font-semibold">{format(new Date(workOrder.completedDate), 'MMM dd, yyyy')}</div>
                    </div>
                  )}
                  {workOrder.assignedTechnician && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Technician</div>
                      <div className="text-sm text-gray-900 font-semibold">{workOrder.assignedTechnician}</div>
                    </div>
                  )}
                  {workOrder.estimatedHours && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Est. Hours</div>
                      <div className="text-sm text-gray-900 font-semibold">{workOrder.estimatedHours}h</div>
                    </div>
                  )}
                  {workOrder.actualHours && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Actual Hours</div>
                      <div className="text-sm text-gray-900 font-semibold">
                        {workOrder.actualHours}h
                        {workOrder.estimatedHours && (
                          <span className={cn(
                            "ml-1.5 text-xs font-normal",
                            workOrder.actualHours > workOrder.estimatedHours ? 'text-red-600' : 
                            workOrder.actualHours < workOrder.estimatedHours ? 'text-green-600' : 'text-gray-500'
                          )}>
                            ({workOrder.actualHours > workOrder.estimatedHours ? '+' : ''}{workOrder.actualHours - workOrder.estimatedHours}h)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {workOrder.assignedTeam && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Team</div>
                      <div className="text-sm text-gray-900 font-semibold">{workOrder.assignedTeam}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 4: Cost & Status */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-gray-300">
                  <Tag className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Cost & Status</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Est. Cost</div>
                    <div className="text-sm text-gray-900 font-semibold">
                      ${(workOrder.estimatedCost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  {workOrder.actualCost && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Actual Cost</div>
                      <div className="text-sm text-gray-900 font-semibold">
                        ${workOrder.actualCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {workOrder.estimatedCost && (
                          <span className={cn(
                            "ml-1.5 text-xs font-normal",
                            workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600' : 
                            workOrder.actualCost < workOrder.estimatedCost ? 'text-green-600' : 'text-gray-500'
                          )}>
                            ({workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}${(workOrder.actualCost - workOrder.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {workOrder.estimatedCost && workOrder.actualCost && (
                    <div className="pt-2 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1 font-medium">Variance</div>
                        <div className={cn(
                          "text-sm font-semibold",
                          workOrder.actualCost > workOrder.estimatedCost ? 'text-red-600' : 
                          workOrder.actualCost < workOrder.estimatedCost ? 'text-green-600' : 'text-gray-600'
                        )}>
                          {workOrder.actualCost > workOrder.estimatedCost ? '+' : ''}
                          ${Math.abs(workOrder.actualCost - workOrder.estimatedCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {' '}({((Math.abs(workOrder.actualCost - workOrder.estimatedCost) / workOrder.estimatedCost) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Priority</div>
                    <PriorityBadge priority={workOrder.priority} size="sm" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Status</div>
                    <StatusBadge status={statusType} label={statusLabel} size="sm" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Work Order ID</div>
                    <div className="text-sm text-gray-900 font-mono font-semibold">{workOrder.workOrderId}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Attachments - Full Width with Action Buttons */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes with Edit Button */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Notes</h4>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit Notes:', workOrder.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 text-yellow-700 shadow-sm hover:shadow-md"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Edit Notes
                    </Button>
                  </div>
                  {workOrder.notes ? (
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{workOrder.notes}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-500 italic">No notes available</p>
                    </div>
                  )}
                </div>

                {/* Attachments with Add Button */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-gray-300">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-yellow-600" />
                      <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">
                        Attachments {workOrder.attachments && workOrder.attachments.length > 0 && `(${workOrder.attachments.length})`}
                      </h4>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Add Attachment:', workOrder.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 text-yellow-700 shadow-sm hover:shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add Attachment
                    </Button>
                  </div>
                  {workOrder.attachments && workOrder.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {workOrder.attachments.map((attachment) => (
                        <div key={attachment.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                          <FileText className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 font-semibold truncate">{attachment.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{format(new Date(attachment.uploadedAt), 'MMM dd, yyyy')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-500 italic">No attachments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

