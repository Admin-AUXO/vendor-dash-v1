import { useState } from 'react';
import { FileText, Tag, Building2, MapPin, Calendar, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { StatusBadge } from '../badges/StatusBadge';
import { Button } from '../../ui';
import { cn } from '../../ui/utils';
import { format } from 'date-fns';
import currency from 'currency.js';
import type { Invoice } from '../../../data';
import { useWorkOrderLookup } from '../hooks/useWorkOrderLookup';

interface InvoiceCardProps {
  invoice: Invoice;
  onViewDetails?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive' | 'outline';
  className?: string;
}

/**
 * InvoiceCard Component
 * 
 * A card component for displaying invoice information with expandable details.
 * Used for pre-submission (draft) invoices.
 */
export function InvoiceCard({ 
  invoice, 
  onViewDetails, 
  onAction,
  actionLabel,
  actionVariant = 'default',
  className 
}: InvoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const workOrderLookup = useWorkOrderLookup();
  const workOrderDisplayId = invoice.workOrderId ? workOrderLookup.get(invoice.workOrderId) : null;
  
  const statusType = 
    invoice.status === 'paid' ? 'success' :
    invoice.status === 'overdue' ? 'error' :
    invoice.status === 'disputed' ? 'error' :
    invoice.status === 'approved' ? 'success' :
    invoice.status === 'viewed' ? 'info' :
    invoice.status === 'sent' ? 'info' :
    'pending';

  const statusLabel = invoice.status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const issueDate = format(new Date(invoice.issueDate), 'MMM dd, yyyy');
  const dueDate = format(new Date(invoice.dueDate), 'MMM dd, yyyy');
  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';

  return (
    <div className={cn(
      'group relative bg-white border border-gray-200 rounded-xl shadow-sm',
      'hover:shadow-md hover:border-primary/30 transition-all duration-300',
      'overflow-hidden border-l-4',
      statusType === 'success' ? 'border-l-status-success' :
      statusType === 'error' ? 'border-l-status-error' :
      statusType === 'info' ? 'border-l-status-info' :
      statusType === 'pending' ? 'border-l-status-pending' :
      'border-l-primary',
      className
    )}>
      <div className="p-4 lg:p-5">
        <div className="flex items-start gap-3 lg:gap-4">
          {/* Enhanced Icon Container */}
          <div className={cn(
            'flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shadow-sm',
            'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
            statusType === 'success' ? 'bg-gradient-to-br from-status-success-light to-emerald-50' :
            statusType === 'error' ? 'bg-gradient-to-br from-status-error-light to-red-50' :
            statusType === 'info' ? 'bg-gradient-to-br from-status-info-light to-blue-50' :
            statusType === 'pending' ? 'bg-gradient-to-br from-status-pending-light to-yellow-50' :
            'bg-gradient-to-br from-primary/20 to-primary/10'
          )}>
            <Receipt className={cn(
              'w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300',
              statusType === 'success' ? 'text-status-success' :
              statusType === 'error' ? 'text-status-error' :
              statusType === 'info' ? 'text-status-info' :
              statusType === 'pending' ? 'text-status-pending' :
              'text-primary'
            )} />
          </div>

          {/* Enhanced Content Area */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header Row - Improved Spacing */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <h3 className="font-semibold text-sm lg:text-base text-gray-900 font-mono flex-shrink-0 tracking-tight">
                  {invoice.invoiceNumber}
                </h3>
                <div className="h-4 w-px bg-gray-300 flex-shrink-0"></div>
                <p className="text-sm text-gray-900 font-semibold truncate">
                  {invoice.clientName}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={statusType} label={statusLabel} size="sm" />
              </div>
            </div>

            {/* Enhanced Info Grid - Better Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-4 gap-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate" title={invoice.clientName}>
                  {invoice.clientName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate" title={invoice.propertyAddress}>
                  {invoice.propertyAddress.split(',')[0]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">
                  {currency(invoice.total).format()}
                </span>
              </div>
              {workOrderDisplayId && (
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="font-mono truncate">{workOrderDisplayId}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">Issued: {issueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Calendar className={cn('w-3.5 h-3.5 flex-shrink-0', isOverdue ? 'text-status-error' : 'text-primary')} />
                <span className={cn('truncate', isOverdue && 'text-status-error font-semibold')}>
                  Due: {dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Button Container */}
          <div className="flex-shrink-0 flex flex-col gap-2.5 items-stretch justify-start min-w-[130px] lg:min-w-[140px]">
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
              className="bg-primary hover:bg-primary-hover text-gray-900 font-semibold border-primary hover:border-primary/20 shadow-sm hover:shadow-md w-full transition-all duration-300"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-1.5 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1.5 transition-transform duration-300" />
              )}
            </Button>

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
                  actionVariant === 'default' 
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

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 ease-in-out">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b-2 border-primary/20">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Client</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Name</div>
                    <div className="text-sm text-gray-900 font-semibold">{invoice.clientName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Address</div>
                    <div className="text-sm text-gray-900 font-semibold">{invoice.clientAddress}</div>
                  </div>
                  {invoice.clientEmail && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Email</div>
                      <a href={`mailto:${invoice.clientEmail}`} className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block font-semibold">
                        {invoice.clientEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b-2 border-primary/20">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Invoice Details</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Invoice Number</div>
                    <div className="text-sm text-gray-900 font-mono font-semibold">{invoice.invoiceNumber}</div>
                  </div>
                  {workOrderDisplayId && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Work Order</div>
                      <div className="text-sm text-gray-900 font-mono font-semibold">{workOrderDisplayId}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Property Address</div>
                    <div className="text-sm text-gray-900 font-semibold">{invoice.propertyAddress}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b-2 border-primary/20">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Dates</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Issue Date</div>
                    <div className="text-sm text-gray-900 font-semibold">{issueDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Due Date</div>
                    <div className={cn('text-sm font-semibold', isOverdue ? 'text-red-600' : 'text-gray-900')}>
                      {dueDate}
                    </div>
                  </div>
                  {invoice.paidDate && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Paid Date</div>
                      <div className="text-sm text-gray-900 font-semibold">{format(new Date(invoice.paidDate), 'MMM dd, yyyy')}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b-2 border-primary/20">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Receipt className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide">Amount</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Subtotal</div>
                    <div className="text-sm text-gray-900 font-semibold">{currency(invoice.subtotal).format()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Tax</div>
                    <div className="text-sm text-gray-900 font-semibold">{currency(invoice.taxAmount).format()}</div>
                  </div>
                  {invoice.discount && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 font-medium">Discount</div>
                      <div className="text-sm text-gray-900 font-semibold">{currency(invoice.discount).format()}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Total</div>
                    <div className="text-base text-gray-900 font-semibold">{currency(invoice.total).format()}</div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.lineItems && invoice.lineItems.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide mb-3">Line Items</h4>
                <div className="space-y-2">
                  {invoice.lineItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.description}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity} × {currency(item.unitPrice).format()}</div>
                      </div>
                      <div className="font-semibold text-gray-900">{currency(item.total).format()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {invoice.notes && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h4 className="text-xs font-display font-bold text-gray-900 uppercase tracking-wide mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

