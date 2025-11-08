import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed antialiased",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] shadow-md border border-transparent hover:border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-600 hover:shadow-lg active:scale-[0.98] shadow-md border border-transparent hover:border-red-700/20",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary hover:shadow-md active:scale-[0.98] hover:border-primary/60",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-gray-200 hover:shadow-md active:scale-[0.98] shadow-sm border border-transparent hover:border-gray-300/50",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-gray-100 active:scale-[0.98] hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[40px] text-sm leading-tight tracking-tight",
        sm: "h-8 rounded-lg px-3 text-xs min-h-[32px] leading-tight tracking-tight",
        lg: "h-12 rounded-lg px-8 min-h-[48px] text-base leading-tight tracking-tight",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

