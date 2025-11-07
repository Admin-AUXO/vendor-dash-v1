import React from 'react';
import {
  Collapsible as CollapsiblePrimitive,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { cn } from '../ui/utils';

interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Collapsible Component
 * 
 * Expandable/collapsible content section
 * 
 * @example
 * <Collapsible
 *   trigger={<Button>Toggle</Button>}
 *   defaultOpen={false}
 * >
 *   <p>Collapsible content</p>
 * </Collapsible>
 */
export function Collapsible({
  trigger,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <CollapsiblePrimitive
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('w-full', className)}
    >
      <CollapsibleTrigger asChild>{trigger}</CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </CollapsiblePrimitive>
  );
}

