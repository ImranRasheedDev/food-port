import { cn } from "@/lib/utils"
import { forwardRef } from "react"

/**
 * InputWithIcon component with left and right icon support
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.icon - Left icon element
 * @param {React.ReactNode} props.rightIcon - Right icon element
 * @param {string} props.error - Error message to display
 * @param {Object} ref - Forwarded ref
 */
export const InputWithIcon = forwardRef(({ className, icon, rightIcon, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "w-full h-14 rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
                        icon ? "pl-14" : "pl-6",
                        rightIcon ? "pr-14" : "pr-6",
                        error && "border-red-500 focus:ring-red-500",
                        className,
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p
                    id={`${props.id || 'input'}-error`}
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}
        </div>
    )
})

InputWithIcon.displayName = "InputWithIcon"
