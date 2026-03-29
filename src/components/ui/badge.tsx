import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#D4A84B]/15 text-[#8F6B28]",
        outline: "border-stone-200 text-stone-600",
        top: "border-emerald-200 bg-emerald-50 text-emerald-800",
        heart: "border-rose-200 bg-rose-50 text-rose-800",
        base: "border-[#D4A84B]/30 bg-[#D4A84B]/10 text-[#8F6B28]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
