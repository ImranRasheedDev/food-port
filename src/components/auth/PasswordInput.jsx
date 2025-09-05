import { forwardRef, useState, useCallback } from "react"
import { InputWithIcon } from "./InputWithIcon"
import { Eye, EyeOff, Lock } from "lucide-react"

/**
 * PasswordInput component with toggle visibility functionality
 * @param {Object} props - Component props
 * @param {string} props.error - Error message to display
 * @param {boolean} props.showIcon - Whether to show the lock icon (default: true)
 * @param {Object} ref - Forwarded ref
 */
export const PasswordInput = forwardRef(({ error, showIcon = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    return (
        <InputWithIcon
            ref={ref}
            type={showPassword ? "text" : "password"}
            icon={showIcon ? <Lock className="w-5 h-5" /> : undefined}
            rightIcon={
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            }
            error={error}
            {...props}
        />
    )
})

PasswordInput.displayName = "PasswordInput"
