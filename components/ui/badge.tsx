import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap select-none antialiased",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md hover:scale-105 active:scale-100",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-gray-300 hover:shadow-md hover:scale-105 active:scale-100",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-red-600 hover:shadow-md hover:scale-105 active:scale-100",
        outline:
          "text-foreground border-2 border-border bg-white shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/60 hover:shadow-md hover:scale-105 active:scale-100",
        success:
          "border border-status-success/40 bg-status-success-light text-status-success shadow-sm hover:bg-status-success/15 hover:border-status-success/60 hover:shadow-md hover:scale-105 active:scale-100",
        warning:
          "border border-status-warning/40 bg-status-warning-light text-status-warning shadow-sm hover:bg-status-warning/15 hover:border-status-warning/60 hover:shadow-md hover:scale-105 active:scale-100",
        info:
          "border border-status-info/40 bg-status-info-light text-status-info shadow-sm hover:bg-status-info/15 hover:border-status-info/60 hover:shadow-md hover:scale-105 active:scale-100",
      },
      size: {
        default: "px-3 py-1 text-xs leading-tight tracking-tight min-h-[22px]",
        sm: "px-2.5 py-0.5 text-[11px] leading-tight tracking-tight min-h-[20px]",
        lg: "px-3.5 py-1.5 text-sm leading-tight tracking-tight min-h-[26px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
