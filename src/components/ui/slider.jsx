import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(
  ({ className, min = 0, max = 100, step = 1, value, onValueChange, showValue = true, valueSuffix = "", ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn("relative w-full", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary-50
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary-50
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-primary-50, #f97316) 0%, var(--color-primary-50, #f97316) ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
          {...props}
        />
        {showValue && (
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{min}{valueSuffix}</span>
            <span className="font-medium text-primary-50">{value}{valueSuffix}</span>
            <span>{max}{valueSuffix}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
