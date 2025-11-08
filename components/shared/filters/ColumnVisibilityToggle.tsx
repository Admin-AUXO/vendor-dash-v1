import { useState, useEffect, useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui';
import { Columns, Check } from 'lucide-react';
import { cn } from '../../ui/utils';

interface ColumnVisibilityToggleProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function ColumnVisibilityToggle<TData>({
  table,
  className,
}: ColumnVisibilityToggleProps<TData>) {
  const [open, setOpen] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<Record<string, boolean>>({});

  // Get all columns, separating essential from optional
  const allColumns = table.getAllColumns();
  const essentialColumns = allColumns.filter((column) => {
    const meta = column.columnDef.meta as any;
    return meta?.essential === true;
  });
  const optionalColumns = allColumns.filter((column) => {
    const meta = column.columnDef.meta as any;
    return meta?.essential !== true;
  });

  // Initialize pending visibility with current visibility state
  useEffect(() => {
    if (open) {
      const currentVisibility: Record<string, boolean> = {};
      optionalColumns.forEach((column) => {
        currentVisibility[column.id] = column.getIsVisible();
      });
      setPendingVisibility(currentVisibility);
    }
  }, [open, optionalColumns]);

  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    return optionalColumns.some((column) => {
      const currentVisible = column.getIsVisible();
      const pendingVisible = pendingVisibility[column.id] ?? currentVisible;
      return currentVisible !== pendingVisible;
    });
  }, [optionalColumns, pendingVisibility]);

  // Handle apply
  const handleApply = () => {
    optionalColumns.forEach((column) => {
      const pendingVisible = pendingVisibility[column.id];
      if (pendingVisible !== undefined && pendingVisible !== column.getIsVisible()) {
        column.toggleVisibility(pendingVisible);
      }
    });
    setOpen(false);
  };

  // Handle cancel (reset to current state)
  const handleCancel = () => {
    const currentVisibility: Record<string, boolean> = {};
    optionalColumns.forEach((column) => {
      currentVisibility[column.id] = column.getIsVisible();
    });
    setPendingVisibility(currentVisibility);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Reset pending changes when closing without applying
        const currentVisibility: Record<string, boolean> = {};
        optionalColumns.forEach((column) => {
          currentVisibility[column.id] = column.getIsVisible();
        });
        setPendingVisibility(currentVisibility);
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("flex items-center gap-2", className)}>
          <Columns className="w-4 h-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {essentialColumns.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Essential (Always Visible)
            </DropdownMenuLabel>
            {essentialColumns.map((column) => {
              const header = typeof column.columnDef.header === 'function'
                ? column.id
                : (column.columnDef.header as string) || column.id;
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                >
                  {header}
                </DropdownMenuCheckboxItem>
              );
            })}
            {optionalColumns.length > 0 && <DropdownMenuSeparator />}
          </>
        )}
        {optionalColumns.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Optional
            </DropdownMenuLabel>
            {optionalColumns.map((column) => {
              const header = typeof column.columnDef.header === 'function'
                ? column.id
                : (column.columnDef.header as string) || column.id;
              const isVisible = pendingVisibility[column.id] ?? column.getIsVisible();
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={isVisible}
                  onCheckedChange={(value) => {
                    setPendingVisibility((prev) => ({
                      ...prev,
                      [column.id]: !!value,
                    }));
                  }}
                >
                  {header}
                </DropdownMenuCheckboxItem>
              );
            })}
          </>
        )}
        {optionalColumns.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={optionalColumns.every((col) => {
                const visible = pendingVisibility[col.id] ?? col.getIsVisible();
                return visible;
              })}
              onCheckedChange={(value) => {
                const newVisibility: Record<string, boolean> = {};
                optionalColumns.forEach((col) => {
                  newVisibility[col.id] = !!value;
                });
                setPendingVisibility(newVisibility);
              }}
              className="font-medium"
            >
              Show All Optional
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!hasPendingChanges}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-1" />
                Apply
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

