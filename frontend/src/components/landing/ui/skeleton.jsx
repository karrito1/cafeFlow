import { cn } from "../../../lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-landing-primary/10", className)}
      {...props} />
  );
}

export { Skeleton }
