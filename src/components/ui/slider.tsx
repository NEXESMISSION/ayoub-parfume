"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderSize = "default" | "touch";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    size?: SliderSize;
  }
>(({ className, size = "default", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      size === "touch" && "min-h-[3.25rem] py-4",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative w-full grow overflow-hidden rounded-full bg-stone-200",
        size === "default" && "h-2",
        size === "touch" && "h-5 rounded-full shadow-inner sm:h-6"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full bg-gradient-to-r from-[#D4A84B] to-[#A67C2E]",
          size === "touch" && "rounded-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block rounded-full border bg-white shadow transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5973E]/60 active:scale-95",
        size === "default" &&
          "h-4 w-4 border-[#D4A84B] focus:ring-2 focus:ring-[#C5973E]/50",
        size === "touch" &&
          "h-11 w-11 border-2 border-[#C5973E] shadow-lg sm:h-12 sm:w-12"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
