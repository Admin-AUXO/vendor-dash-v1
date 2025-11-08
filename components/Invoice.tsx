import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { 
  StatCard, 
  FilterSystem,
  FilterPanelSlideIn,
  DataTable,
  StatusBadge,
  ExportButton,
  EmptyState,
  ColumnVisibilityToggle,
  TableActions,
  type FilterGroup,
  type TableAction,
} from './shared';
import { 
  FileText, 
  Tag, 
  Clock, 
  AlertCircle,
  Edit,
  Download,
  Send,
  Eye,
  Filter,
  Building2,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Receipt,
  Plus,
  Mail
} from 'lucide-react';
import { invoices, workOrders, type Invoice } from '../data';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import currency from 'currency.js';
import { DateRange } from './shared/DateRangePicker';
import { cn } from './ui/utils';


export function Invoice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: [],
    client: [],
  });
  const [issueDateRange, setIssueDateRange] = useState<DateRange | undefined>();
  const [dueDateRange, setDueDateRange] = useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<any>(null);

  // Stable callback for table ready
  const handleTableReady = useCallback((table: any) => {
    setTableInstance(table);
  }, []);

  // Create work order lookup map (internal ID -> display ID)
  const workOrderLookup = useMemo(() => {
    const lookup = new Map<string, string>();
    workOrders.forEach(wo => {
      lookup.set(wo.id, wo.workOrderId);
    });
    return lookup;
  }, []);

  // Get unique client names for filter with counts
  const filterOptions = useMemo(() => {
    const clients = Array.from(new Set(invoices.map(inv => inv.clientName))).sort();
    
    // Calculate counts for each filter option
    const statusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const clientCounts = invoices.reduce((acc, inv) => {
      acc[inv.clientName] = (acc[inv.clientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      clients,
      statusCounts,
      clientCounts,
    };
  }, []);

  // Get min and max amounts for range filter
  const amountStats = useMemo(() => {
    const amounts = invoices.map(inv => inv.total);
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
    };
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    let data = invoices;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (inv: Invoice) => {
          const workOrderDisplayId = inv.workOrderId ? workOrderLookup.get(inv.workOrderId) : null;
          return (
            inv.invoiceNumber.toLowerCase().includes(query) ||
            inv.clientName.toLowerCase().includes(query) ||
            (workOrderDisplayId && workOrderDisplayId.toLowerCase().includes(query))
          );
        }
      );
    }

    // Apply status filter
    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
      data = data.filter((inv: Invoice) => filters.status.includes(inv.status));
    }

    // Apply client filter
    if (filters.client && Array.isArray(filters.client) && filters.client.length > 0) {
      data = data.filter((inv: Invoice) => filters.client.includes(inv.clientName));
    }

    // Apply issue date range filter
    if (issueDateRange?.from) {
      data = data.filter((inv: Invoice) => {
        const issueDate = new Date(inv.issueDate);
        const from = issueDateRange.from!;
        const to = issueDateRange.to || issueDateRange.from!;
        return issueDate >= from && issueDate <= to;
      });
    }

    // Apply due date range filter
    if (dueDateRange?.from) {
      data = data.filter((inv: Invoice) => {
        const dueDate = new Date(inv.dueDate);
        const from = dueDateRange.from!;
        const to = dueDateRange.to || dueDateRange.from!;
        return dueDate >= from && dueDate <= to;
      });
    }

    // Apply amount range filter
    if (amountRange.min !== null || amountRange.max !== null) {
      data = data.filter((inv: Invoice) => {
        const amount = inv.total;
        const min = amountRange.min ?? -Infinity;
        const max = amountRange.max ?? Infinity;
        return amount >= min && amount <= max;
      });
    }

    return data;
  }, [searchQuery, filters, issueDateRange, dueDateRange, amountRange, workOrderLookup]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
    const pending = invoices.filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved').length;
    const overdue = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;
    const paidAmount = invoices
      .filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const pendingAmount = invoices
      .filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'approved')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);
    const overdueAmount = invoices
      .filter((inv: Invoice) => inv.status === 'overdue')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return { total, paid, pending, overdue, paidAmount, pendingAmount, overdueAmount };
  }, []);

  // Handle stat card click to filter by status
  const handleStatCardClick = (statusType: 'all' | 'paid' | 'pending' | 'overdue') => {
    if (statusType === 'all') {
      setFilters({ ...filters, status: [] });
    } else if (statusType === 'paid') {
      setFilters({ ...filters, status: ['paid'] });
    } else if (statusType === 'pending') {
      setFilters({ ...filters, status: ['sent', 'viewed', 'approved'] });
    } else if (statusType === 'overdue') {
      setFilters({ ...filters, status: ['overdue'] });
    }
  };

  // Separate invoices into pre-submission and post-submission
  const preSubmissionInvoices = useMemo(() => {
    return invoices.filter((inv: Invoice) => inv.status === 'draft');
  }, []);

  // Post-submission: only sent/viewed (follow-up emails), excluding overdue (moved to Payments page)
  const postSubmissionInvoices = useMemo(() => {
    return invoices.filter((inv: Invoice) => 
      ['sent', 'viewed'].includes(inv.status)
    );
  }, []);

  // Invoice Card Component
  // Post-Submission Invoice Card Component
  const PostSubmissionInvoiceCard = ({ invoice, onViewDetails, onAction, actionLabel, actionVariant = 'default' }: {
    invoice: Invoice;
    onViewDetails?: () => void;
    onAction?: () => void;
    actionLabel?: string;
    actionVariant?: 'default' | 'destructive' | 'outline';
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
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
    // Check if dueDate exists and is valid
    let hasDueDate = false;
    let dueDate: string | null = null;
    let isOverdue = false;
    
    if (invoice.dueDate && invoice.dueDate.trim() !== '') {
      try {
        const dueDateObj = new Date(invoice.dueDate);
        if (!isNaN(dueDateObj.getTime())) {
          hasDueDate = true;
          dueDate = format(dueDateObj, 'MMM dd, yyyy');
          isOverdue = dueDateObj < new Date() && invoice.status !== 'paid';
        }
      } catch (e) {
        // Invalid date, treat as no due date
        hasDueDate = false;
      }
    }

    return (
      <div className={cn(
        'group relative bg-white border border-gray-200 rounded-xl shadow-sm',
        'hover:shadow-md hover:border-primary/30 transition-all duration-300',
        'overflow-hidden border-l-4',
        statusType === 'success' ? 'border-l-status-success' :
        statusType === 'error' ? 'border-l-status-error' :
        statusType === 'info' ? 'border-l-status-info' :
        statusType === 'pending' ? 'border-l-status-pending' :
        'border-l-primary'
      )}>
        <div className="p-4 lg:p-5">
          <div className="flex items-start gap-3 lg:gap-4">
            {/* Enhanced Icon Container */}
            <div className={cn(
              'flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shadow-sm',
              'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
              statusType === 'info' ? 'bg-gradient-to-br from-status-info-light to-blue-50' :
              'bg-gradient-to-br from-primary/20 to-primary/10'
            )}>
              <Receipt className={cn(
                'w-6 h-6 lg:w-7 lg:h-7 transition-colors duration-300',
                statusType === 'info' ? 'text-status-info' :
                'text-primary'
              )} />
            </div>

            {/* Enhanced Content Area */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header Row - Separator between Invoice ID and Client Name */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm lg:text-base text-gray-900 font-mono flex-shrink-0 tracking-tight">
                    {invoice.invoiceNumber}
                  </h3>
                  {/* Separator */}
                  <div className="h-4 w-px bg-gray-300 flex-shrink-0"></div>
                  {/* Client Name - Left Aligned */}
                  <p className="text-sm text-gray-900 font-semibold text-left">
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
                {workOrderDisplayId && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="font-mono truncate">{workOrderDisplayId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate" title={invoice.propertyAddress}>
                    {invoice.propertyAddress.split(',')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">Issued: {issueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-900">
                  <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="truncate">
                    {currency(invoice.total).format()}
                  </span>
                </div>
                {/* Due Date or Badge - Aligned */}
                <div className="flex items-center gap-2">
                  {hasDueDate ? (
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Calendar className={cn('w-3.5 h-3.5 flex-shrink-0', isOverdue ? 'text-status-error' : 'text-primary')} />
                      <span className={cn('truncate', isOverdue && 'text-status-error font-semibold')}>
                        Due: {dueDate}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="warning" className="text-xs font-semibold">
                      No Due Date
                    </Badge>
                  )}
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
                variant="outline"
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
                      {hasDueDate ? (
                        <div className={cn('text-sm font-semibold', isOverdue ? 'text-red-600' : 'text-gray-900')}>
                          {dueDate}
                        </div>
                      ) : (
                        <Badge variant="warning" className="text-xs">
                          No Due Date
                        </Badge>
                      )}
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
  };

  const InvoiceCard = ({ invoice, onViewDetails, onAction, actionLabel, actionVariant = 'default' }: {
    invoice: Invoice;
    onViewDetails?: () => void;
    onAction?: () => void;
    actionLabel?: string;
    actionVariant?: 'default' | 'destructive' | 'outline';
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
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
        'border-l-primary'
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
  };


  // Define columns
  const columns: ColumnDef<Invoice>[] = useMemo(() => [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
      meta: { essential: true },
      cell: ({ row }) => (
        <span className="font-semibold text-sm font-mono">{row.original.invoiceNumber}</span>
      ),
    },
    {
      accessorKey: 'workOrderId',
      header: 'Work Order',
      meta: { essential: false },
      cell: ({ row }) => {
        const workOrderDisplayId = row.original.workOrderId 
          ? workOrderLookup.get(row.original.workOrderId) 
          : null;
        return (
          <span className="text-sm text-gray-900 font-mono">
            {workOrderDisplayId || 'N/A'}
          </span>
        );
      },
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      meta: { essential: false },
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.clientName}</span>
      ),
    },
    {
      id: 'dates',
      header: 'Dates',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => {
        const issueDate = format(new Date(row.original.issueDate), 'MMM dd, yyyy');
        const dueDate = format(new Date(row.original.dueDate), 'MMM dd, yyyy');
        return (
          <div className="text-sm text-center">
            <div className="text-gray-900 font-medium">{issueDate}</div>
            <div className="text-gray-500 text-xs">Due: {dueDate}</div>
          </div>
        );
      },
    },
    {
      id: 'daysOverdue',
      header: 'Overdue',
      meta: { headerAlign: 'center', essential: false },
      cell: ({ row }) => {
        const invoice = row.original;
        if (invoice.status === 'overdue' || (invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date())) {
          const dueDate = new Date(invoice.dueDate);
          const today = new Date();
          const diffTime = today.getTime() - dueDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 0) {
            return (
              <span className="text-sm font-medium text-red-600">
                {diffDays} day{diffDays !== 1 ? 's' : ''}
              </span>
            );
          }
        }
        return <span className="text-sm text-gray-400">—</span>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      meta: { headerAlign: 'center', cellAlign: 'center', essential: false },
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">
          {currency(row.original.total).format()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { headerAlign: 'center', essential: true },
      cell: ({ row }) => {
        const status = row.original.status;
        const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'info' | 'pending', label: string }> = {
          'paid': { type: 'success', label: 'Paid' },
          'approved': { type: 'success', label: 'Approved' },
          'sent': { type: 'info', label: 'Sent' },
          'viewed': { type: 'info', label: 'Viewed' },
          'draft': { type: 'pending', label: 'Draft' },
          'overdue': { type: 'error', label: 'Overdue' },
          'disputed': { type: 'warning', label: 'Disputed' },
          'cancelled': { type: 'error', label: 'Cancelled' },
        };
        const mapped = statusMap[status] || { type: 'pending' as const, label: status };
        return <div className="flex justify-center"><StatusBadge status={mapped.type} label={mapped.label} /></div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { essential: true, headerAlign: 'center', cellAlign: 'center' },
      cell: ({ row }) => {
        const invoice = row.original;
        const canEdit = invoice.status === 'draft' || invoice.status === 'sent' || invoice.status === 'viewed';
        const canSend = invoice.status === 'draft' || invoice.status === 'sent';
        const canDownload = invoice.status !== 'draft';

        const primaryAction: TableAction = {
          label: 'View',
          icon: Eye,
          onClick: () => {
            // Handle view action
            console.log('View invoice:', invoice.invoiceNumber);
          },
        };

        const secondaryActions: TableAction[] = [];
        
        if (canEdit) {
          secondaryActions.push({
            label: 'Edit',
            icon: Edit,
            onClick: () => {
              console.log('Edit invoice:', invoice.invoiceNumber);
            },
          });
        }

        if (canDownload) {
          secondaryActions.push({
            label: 'Download',
            icon: Download,
            onClick: () => {
              console.log('Download invoice:', invoice.invoiceNumber);
            },
          });
        }

        if (canSend && invoice.status !== 'paid' && invoice.status !== 'cancelled') {
          secondaryActions.push({
            label: 'Send',
            icon: Send,
            onClick: () => {
              console.log('Send invoice:', invoice.invoiceNumber);
            },
          });
        }

        return <TableActions primaryAction={primaryAction} secondaryActions={secondaryActions} />;
      },
    },
  ], [workOrderLookup]);

  // Filter configuration with dynamic counts
  const filterConfig: FilterGroup[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      searchable: false,
      options: [
        { value: 'draft', label: 'Draft', count: filterOptions.statusCounts['draft'] || 0 },
        { value: 'sent', label: 'Sent', count: filterOptions.statusCounts['sent'] || 0 },
        { value: 'viewed', label: 'Viewed', count: filterOptions.statusCounts['viewed'] || 0 },
        { value: 'approved', label: 'Approved', count: filterOptions.statusCounts['approved'] || 0 },
        { value: 'paid', label: 'Paid', count: filterOptions.statusCounts['paid'] || 0 },
        { value: 'overdue', label: 'Overdue', count: filterOptions.statusCounts['overdue'] || 0 },
        { value: 'disputed', label: 'Disputed', count: filterOptions.statusCounts['disputed'] || 0 },
        { value: 'cancelled', label: 'Cancelled', count: filterOptions.statusCounts['cancelled'] || 0 },
      ],
    },
    {
      id: 'client',
      label: 'Client',
      type: 'checkbox',
      searchable: true,
      options: filterOptions.clients.map(name => ({
        value: name,
        label: name,
        count: filterOptions.clientCounts[name] || 0,
      })),
    },
  ], [filterOptions]);

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = Object.values(filters).reduce((acc, value) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    
    if (issueDateRange?.from) count += 1;
    if (dueDateRange?.from) count += 1;
    if (amountRange?.min !== null || amountRange?.max !== null) count += 1;
    
    return count;
  }, [filters, issueDateRange, dueDateRange, amountRange]);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="mb-2">
        <p className="text-sm text-gray-600 font-medium leading-relaxed">Track invoices, monitor payment status, and manage billing for your service operations.</p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => handleStatCardClick('all')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('all');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by all invoices"
        >
          <StatCard
            title="Total Invoices"
            value={summaryStats.total.toString()}
            icon={FileText}
            tooltip="Total count of all invoices across all statuses. Click to view all."
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('paid')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('paid');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by paid invoices"
        >
          <StatCard
            title="Paid Amount"
            value={currency(summaryStats.paidAmount).format()}
            change={`${summaryStats.paid} paid`}
            icon={Tag}
            tooltip="Total amount received from paid invoices. Click to filter by paid invoices."
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('pending')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('pending');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by pending invoices"
        >
          <StatCard
            title="Pending Amount"
            value={currency(summaryStats.pendingAmount).format()}
            change={`${summaryStats.pending} pending`}
            icon={Clock}
            tooltip="Total amount of invoices awaiting payment. Click to filter by pending invoices."
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('overdue')} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStatCardClick('overdue');
            }
          }}
          className="cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg h-full"
          role="button"
          tabIndex={0}
          aria-label="Filter by overdue invoices"
        >
          <StatCard
            title="Overdue Amount"
            value={currency(summaryStats.overdueAmount).format()}
            change={`${summaryStats.overdue} overdue`}
            trend={summaryStats.overdue > 0 ? "down" : "neutral"}
            icon={AlertCircle}
            tooltip="Total amount of invoices past their due date. Click to filter by overdue invoices."
          />
        </div>
      </div>

      {/* Pre-Submission and Post-Submission Invoices */}
      <div className="space-y-6 lg:space-y-8">
        {/* Pre-Submission Invoices Section */}
        <div className="space-y-4">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-yellow-50/80 via-yellow-50/50 to-transparent rounded-xl border border-yellow-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-yellow-100/80 shadow-sm">
                <FileText className="w-5 h-5 text-yellow-700" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                    Pre-Submission Invoices
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Draft invoices ready to be sent
                  </p>
                </div>
                <Badge variant="warning" className="font-semibold shadow-sm min-w-[28px] justify-center">
                {preSubmissionInvoices.length}
              </Badge>
            </div>
            </div>
            <Button 
              size="sm" 
              variant="default"
              className="bg-primary hover:bg-primary-hover text-gray-900 font-semibold shadow-md hover:shadow-lg border-primary hover:border-primary/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Draft
            </Button>
          </div>
          
          {/* Enhanced Card Container */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 lg:p-5">
              {preSubmissionInvoices.length > 0 ? (
                <div className="space-y-3 lg:space-y-4">
                  {preSubmissionInvoices.map((invoice: Invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onViewDetails={() => console.log('View invoice:', invoice.invoiceNumber)}
                      onAction={() => console.log('Send invoice:', invoice.invoiceNumber)}
                      actionLabel="Send Invoice"
                      actionVariant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 lg:py-12">
                  <EmptyState
                    title="No pre-submission invoices"
                    description="Draft invoices ready to be sent will appear here. Create your first draft to get started."
                    variant="empty"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Post-Submission Invoices Section */}
        <div className="space-y-4">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-transparent rounded-xl border border-blue-200/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100/80 shadow-sm">
                <Mail className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">
                    Post-Submission Invoices
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Sent invoices awaiting client response
                  </p>
                </div>
                <Badge variant="info" className="font-semibold shadow-sm min-w-[28px] justify-center">
              {postSubmissionInvoices.length}
            </Badge>
          </div>
            </div>
          </div>
          
          {/* Enhanced Card Container */}
          <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4 lg:p-5">
              {postSubmissionInvoices.length > 0 ? (
                <div className="space-y-3 lg:space-y-4">
                  {postSubmissionInvoices.map((invoice: Invoice) => (
                    <PostSubmissionInvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      onViewDetails={() => console.log('View invoice:', invoice.invoiceNumber)}
                      onAction={() => console.log('Follow up:', invoice.invoiceNumber)}
                      actionLabel="Follow Up"
                      actionVariant="default"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 lg:py-12">
                  <EmptyState
                    title="No post-submission invoices"
                    description="Invoices that have been sent and are awaiting client response will appear here."
                    variant="empty"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter System - Mobile */}
      <div className="lg:hidden">
        <FilterSystem
          filters={filterConfig}
          filterValues={filters}
          onFilterChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredData.length}
          totalCount={invoices.length}
          searchPlaceholder="Search invoices by number, client name, work order..."
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-4 lg:space-y-6">
          <div className="space-y-3">
            <FilterSystem
              filters={filterConfig}
              filterValues={filters}
              onFilterChange={setFilters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredData.length}
              totalCount={invoices.length}
              searchPlaceholder="Search invoices by number, client name, work order..."
              showSearchBar={true}
              showFilterBar={true}
            />
          </div>

          <Card>
            <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-display font-semibold text-gray-900 tracking-tight">
                All Invoices
                <Badge variant="warning" className="font-semibold">
                  {filteredData.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <ExportButton
                  data={filteredData}
                  filename="invoices"
                />
                {tableInstance && (
                  <ColumnVisibilityToggle table={tableInstance} />
                )}
              </div>
            </div>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <DataTable
                  data={filteredData}
                  columns={columns}
                  pagination
                  pageSize={10}
                  searchable={false}
                  storageKey="invoices"
                  onTableReady={handleTableReady}
                />
              ) : (
                <EmptyState
                  title="No invoices found"
                  description="Try adjusting your search or filters"
                  variant="no-results"
                />
              )}
            </CardContent>
          </Card>
      </div>

      {/* Mobile Data Table */}
      <div className="lg:hidden mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoices ({filteredData.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <DataTable
                data={filteredData}
                columns={columns}
                pagination
                pageSize={10}
                searchable={false}
              />
            ) : (
              <EmptyState
                title="No invoices found"
                description="Try adjusting your search or filters"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Slide-in Filter Panel */}
      <FilterPanelSlideIn
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={setFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredData.length}
        totalCount={invoices.length}
        searchPlaceholder="Search invoices by number, client name, work order..."
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        issueDateRange={issueDateRange}
        onIssueDateRangeChange={setIssueDateRange}
        dueDateRange={dueDateRange}
        onDueDateRangeChange={setDueDateRange}
        amountRange={amountRange}
        onAmountRangeChange={setAmountRange}
        amountStats={amountStats}
      />
    </div>
  );
}

