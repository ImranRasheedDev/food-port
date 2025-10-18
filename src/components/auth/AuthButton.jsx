import { cn } from "@/lib/utils";
import { forwardRef } from "react";

/**
 * AuthButton component for authentication forms
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant ('primary' or 'social')
 * @param {React.ReactNode} props.icon - Icon element
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} ref - Forwarded ref
 */
export const AuthButton = forwardRef(
  (
    {
      className,
      variant = "primary",
      icon,
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        type={props.type || "button"}
        className={cn(
          "w-full h-14 rounded-full font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          !isDisabled && "cursor-pointer",
          variant === "primary" && [
            "bg-[#D6071B] text-white",
            !isDisabled && "hover:bg-[#B8061A] active:bg-[#A0051A]",
            "focus:ring-red-500",
          ],
          variant === "social" && [
            "bg-white border border-gray-300 text-gray-700",
            !isDisabled && "hover:bg-gray-50 active:bg-gray-100",
            "focus:ring-gray-500",
          ],
          className
        )}
        aria-busy={loading}
        {...props}
      >
        <div className="flex items-center justify-center gap-3">
          {loading ? (
            <div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          ) : (
            icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {icon}
              </span>
            )
          )}
          <span>{children}</span>
        </div>
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";
