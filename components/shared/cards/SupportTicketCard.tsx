import { useMemo } from 'react';
import { Button, Badge } from '../../ui';
import { PriorityBadge } from '../badges/PriorityBadge';
import { workOrders, type SupportTicket } from '../../../data';
import { format } from 'date-fns';
import { cn } from '../../ui/utils';
import { 
  Clock, 
  MessageSquare,
  Building2,
  Paperclip,
  Calendar,
} from 'lucide-react';

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onViewTicket?: (ticket: SupportTicket) => void;
}

export function SupportTicketCard({ ticket, onViewTicket }: SupportTicketCardProps) {
  // Get client name from related work order if available
  const clientName = useMemo(() => {
    if (ticket.relatedWorkOrderId) {
      const workOrder = workOrders.find(wo => wo.workOrderId === ticket.relatedWorkOrderId);
      return workOrder?.clientName;
    }
    return null;
  }, [ticket.relatedWorkOrderId]);

  const statusType: 'success' | 'warning' | 'info' | 'pending' = 
    ticket.status === 'resolved' || ticket.status === 'closed' ? 'success' :
    ticket.status === 'in-progress' ? 'info' :
    ticket.status === 'waiting-response' ? 'warning' :
    'pending';

  const statusLabel = ticket.status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const messageCount = ticket.messages?.length || 0;
  const attachmentCount = ticket.attachments?.length || 0;

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

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 border-l-4 group cursor-pointer",
      statusType === 'success' ? 'border-l-status-success' :
      statusType === 'info' ? 'border-l-status-info' :
      statusType === 'warning' ? 'border-l-status-warning' :
      statusType === 'pending' ? 'border-l-status-pending' :
      'border-l-primary'
    )}
    onClick={() => onViewTicket?.(ticket)}
    >
      <div className="p-5">
        {/* Header Row - Icon, ID, Status, Priority */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
              statusType === 'success' ? 'bg-gradient-to-br from-status-success-light to-emerald-50' :
              statusType === 'info' ? 'bg-gradient-to-br from-status-info-light to-blue-50' :
              statusType === 'warning' ? 'bg-gradient-to-br from-status-warning-light to-yellow-50' :
              statusType === 'pending' ? 'bg-gradient-to-br from-status-pending-light to-gray-50' :
              'bg-primary/10'
            )}>
              <MessageSquare className={cn(
                "w-6 h-6 transition-colors duration-300",
                statusType === 'success' ? 'text-status-success' :
                statusType === 'info' ? 'text-status-info' :
                statusType === 'warning' ? 'text-status-warning' :
                statusType === 'pending' ? 'text-status-pending' :
                'text-primary'
              )} />
            </div>

            {/* Ticket Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-base text-gray-900 font-mono">
              {ticket.ticketId}
            </h3>
                <div className="h-4 w-px bg-gray-300 flex-shrink-0"></div>
          <PriorityBadge priority={ticket.priority} size="sm" />
          <Badge 
            variant="outline"
            className={cn(
                    'font-semibold shadow-sm',
              statusType === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
              statusType === 'warning' && 'bg-gray-100 text-gray-700 border-gray-300',
              statusType === 'success' && 'bg-status-success-light text-status-success border-status-success/30',
              statusType === 'info' && 'bg-blue-100 text-blue-700 border-blue-300',
            )}
          >
            {statusLabel}
          </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 capitalize text-xs font-medium shadow-sm">
            {ticket.category.replace('-', ' ')}
          </Badge>
        </div>
              <h4 className="font-display font-semibold text-base text-gray-900 mb-2" title={ticket.subject}>
            {ticket.subject}
          </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {ticket.description}
              </p>
        </div>
            </div>
        </div>

        {/* Footer Row - Meta Information */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
        {/* Created Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">{format(new Date(ticket.createdDate), 'MMM dd, yyyy')}</span>
          </div>
            {/* Last Updated */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">Updated {getTimeElapsed(new Date(ticket.updatedDate))}</span>
        </div>
            {/* Messages */}
            {messageCount > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
          </div>
            )}
            {/* Attachments */}
            {attachmentCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{attachmentCount} {attachmentCount === 1 ? 'attachment' : 'attachments'}</span>
              </div>
            )}
            {/* Client */}
            {clientName && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate max-w-[150px]" title={clientName}>{clientName}</span>
              </div>
            )}
        </div>

        {/* View Ticket Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewTicket?.(ticket);
            }}
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary-hover text-gray-900 font-semibold border-primary hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

