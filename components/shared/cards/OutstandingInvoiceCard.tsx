import { FileText, Tag, Building2, AlertCircle } from 'lucide-react';
import { Button, Badge } from '../../ui';
import { cn } from '../../ui/utils';
import { format } from 'date-fns';
import currency from 'currency.js';
import type { Invoice } from '../../../data';
import { useWorkOrderLookup } from '../hooks/useWorkOrderLookup';

interface OutstandingInvoiceCardProps {
  invoice: Invoice;
  onSendReminder?: () => void;
  className?: string;
}

/**
 * OutstandingInvoiceCard Component
 * 
 * A card component for displaying outstanding (unpaid) invoice information.
 * Used in the Payments page to show invoices that require payment.
 */
export function OutstandingInvoiceCard({ 
  invoice, 
  onSendReminder,
  className 
}: OutstandingInvoiceCardProps) {
  const workOrderLookup = useWorkOrderLookup();
  const workOrderDisplayId = invoice.workOrderId ? workOrderLookup.get(invoice.workOrderId) : null;
  
  // Calculate days overdue for any unpaid invoice past due date
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const daysOverdue = invoice.status !== 'paid' && dueDate < today
    ? Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isUrgent = daysOverdue > 0;
  
  // Calculate days until due (if not overdue)
  const daysUntilDue = !isUrgent && dueDate >= today
    ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  // Determine badge to show - always show a badge
  const getStatusBadge = () => {
    if (isUrgent) {
      return (
        <Badge variant="destructive" className="font-semibold text-xs whitespace-nowrap">
          {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
        </Badge>
      );
    } else if (daysUntilDue !== null && daysUntilDue <= 7) {
      return (
        <Badge variant="warning" className="font-semibold text-xs whitespace-nowrap">
          Due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
        </Badge>
      );
    } else {
      return (
        <Badge variant="info" className="font-semibold text-xs whitespace-nowrap">
          Pending Payment
        </Badge>
      );
    }
  };
  
  return (
    <div
      className={cn(
        'group relative bg-white border border-gray-200 rounded-xl shadow-sm',
        'hover:shadow-md hover:border-red-300 transition-all duration-300',
        'overflow-hidden border-l-4',
        isUrgent ? 'border-l-status-error' : 'border-l-red-400',
        className
      )}
    >
      <div className="p-4 lg:p-5">
        {/* Single Row Layout - Invoice ID and Client Name Left Aligned */}
        <div className="flex items-center gap-4 lg:gap-6 flex-wrap lg:flex-nowrap">
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shadow-sm',
            'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
            'bg-gradient-to-br from-red-100 to-red-50'
          )}>
            <FileText className={cn(
              'w-5 h-5 lg:w-6 lg:h-6 transition-colors duration-300',
              'text-red-600'
            )} />
          </div>

          {/* Invoice Number - Left Aligned */}
          <div className="flex items-center justify-start flex-1 min-w-[100px] lg:min-w-[120px]">
            <h3 className="font-semibold text-sm lg:text-base text-gray-900 font-mono tracking-tight text-left">
              {invoice.invoiceNumber}
            </h3>
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-gray-300 flex-shrink-0"></div>

          {/* Client Name - Left Aligned */}
          <div className="flex items-center gap-1.5 justify-start flex-1 min-w-[120px] lg:min-w-[150px]">
            <Building2 className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-gray-900 font-medium text-left truncate" title={invoice.clientName}>
              {invoice.clientName}
            </p>
          </div>

          {/* Work Order ID - Always Show */}
          <div className="flex items-center gap-1.5 justify-center flex-1 min-w-[100px] lg:min-w-[110px]">
            <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm font-mono text-gray-700 text-center">
              {workOrderDisplayId || 'N/A'}
            </span>
          </div>

          {/* Status Badge - Always Show */}
          <div className="flex items-center justify-center flex-1 min-w-[120px] lg:min-w-[140px]">
            {getStatusBadge()}
          </div>

          {/* Amount */}
          <div className="flex items-center gap-1.5 justify-center flex-1 min-w-[100px] lg:min-w-[110px]">
            <Tag className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900 text-center whitespace-nowrap">
              {currency(invoice.total).format()}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-1.5 justify-center flex-1 min-w-[130px] lg:min-w-[150px]">
            <AlertCircle className={cn('w-4 h-4 flex-shrink-0', isUrgent ? 'text-red-600' : 'text-gray-400')} />
            <span className={cn('text-sm font-medium text-center whitespace-nowrap', isUrgent ? 'text-red-600 font-semibold' : 'text-gray-700')}>
              Due: {format(dueDate, 'MMM dd, yyyy')}
            </span>
          </div>

          {/* Send Reminder Button */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[140px] flex items-center justify-center">
            <Button
              variant="default"
              size="sm"
              onClick={() => onSendReminder?.()}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700/30 shadow-sm hover:shadow-md w-full lg:w-auto font-semibold transition-all duration-300 whitespace-nowrap"
            >
              Send Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

