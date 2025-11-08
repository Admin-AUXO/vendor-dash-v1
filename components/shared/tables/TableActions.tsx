import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui';
import { MoreVertical, LucideIcon } from 'lucide-react';

export interface TableAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
}

interface TableActionsProps {
  /**
   * Primary action (usually "View") - shown as icon button with tooltip
   */
  primaryAction?: TableAction;
  
  /**
   * Secondary actions - shown in dropdown menu
   */
  secondaryActions?: TableAction[];
  
  /**
   * Custom className for the actions container
   */
  className?: string;
  
  /**
   * Whether to show actions on hover only (default: false)
   */
  showOnHover?: boolean;
}

/**
 * TableActions component for consistent action column layout in data tables.
 * 
 * Best practices implemented:
 * - Primary action (View) is always visible as icon button with tooltip
 * - Secondary actions grouped in dropdown menu to reduce clutter
 * - Accessible with proper ARIA labels
 * - Clean, minimal design
 * - Works well on mobile devices
 */
export function TableActions({
  primaryAction,
  secondaryActions = [],
  className = '',
  showOnHover = false,
}: TableActionsProps) {
  const hasSecondaryActions = secondaryActions.length > 0;
  const hasAnyActions = primaryAction || hasSecondaryActions;

  if (!hasAnyActions) {
    return null;
  }

  return (
    <TooltipProvider>
      <div
        className={`flex items-center justify-center gap-1 ${showOnHover ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''} ${className}`}
      >
        {/* Primary Action - Always visible as icon button */}
        {primaryAction && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  primaryAction.onClick();
                }}
                disabled={primaryAction.disabled}
                aria-label={primaryAction.label}
              >
                <primaryAction.icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{primaryAction.label}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Secondary Actions - In dropdown menu */}
        {hasSecondaryActions && (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label="More actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>More actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              {secondaryActions.map((action, index) => {
                const ItemContent = (
                  <>
                    <action.icon className="mr-2 h-4 w-4" />
                    <span>{action.label}</span>
                  </>
                );

                // Add separator before destructive actions
                const shouldShowSeparator =
                  index > 0 &&
                  action.variant === 'destructive' &&
                  secondaryActions[index - 1]?.variant !== 'destructive';

                return (
                  <div key={action.label}>
                    {shouldShowSeparator && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                      disabled={action.disabled}
                      className={
                        action.variant === 'destructive'
                          ? 'text-red-600 focus:text-red-600 focus:bg-red-50'
                          : ''
                      }
                    >
                      {ItemContent}
                    </DropdownMenuItem>
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
}

