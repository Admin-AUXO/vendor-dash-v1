import React from 'react';
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { cn } from '../ui/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
}

/**
 * Accordion Component
 * 
 * Collapsible content sections, commonly used for FAQs
 * 
 * @example
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Question 1', content: 'Answer 1' },
 *     { id: '2', title: 'Question 2', content: 'Answer 2' },
 *   ]}
 *   type="single"
 * />
 */
export function Accordion({
  items,
  type = 'single',
  defaultValue,
  className,
}: AccordionProps) {
  return (
    <AccordionPrimitive
      type={type}
      defaultValue={defaultValue}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </AccordionPrimitive>
  );
}

