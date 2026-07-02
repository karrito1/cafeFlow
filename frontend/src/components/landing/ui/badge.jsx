import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "../../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-landing-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-landing-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-landing-primary text-landing-primary-fg shadow hover:bg-landing-primary/80",
        secondary:
          "border-transparent bg-landing-secondary text-landing-secondary-fg hover:bg-landing-secondary/80",
        destructive:
          "border-transparent bg-landing-destructive text-landing-destructive-fg shadow hover:bg-landing-destructive/80",
        outline: "text-landing-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
