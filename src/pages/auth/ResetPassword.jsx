import { AuthButton } from "@/components/auth/AuthButton"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

// Validation patterns
const VALIDATION_PATTERNS = {
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/,
}

function ResetPassword() {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            password: '',
            confirmPassword: '',
        }
    })

    const password = watch("password")

    const onSubmit = useCallback(async (data) => {
        if (isSubmitting) return

        setLoading(true)

        try {
            // Validate required fields
            if (!data.password?.trim() || !data.confirmPassword?.trim()) {
                toast.error("Please fill in all required fields")
                return
            }

            console.log('Reset password data:', data)
            // Mock API call - replace with actual API when available
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Password updated successfully!")

            // TODO: Redirect to login page after successful password reset
            // navigate('/auth/login')
        } catch (error) {
            console.error('Reset password error:', error)
            toast.error("Failed to update password. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [isSubmitting])

    return (
        <AuthLayout
            showBack={true}
            bgImage={"/images/reset-password.jpg"}
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    <span className="text-primary-50"> New </span>{" "}
                    Password
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">Enter the email address or mobile phone number associated with your Food Port account.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password */}
                <PasswordInput
                    id="password"
                    placeholder="Set a New Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                            value: 128,
                            message: "Password must be less than 128 characters",
                        },
                        pattern: {
                            value: VALIDATION_PATTERNS.password,
                            message: "Password must contain at least one letter, one number, and one special character",
                        },
                    })}
                    error={errors.password?.message}
                />

                {/* Confirm Password */}
                <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm New Password"
                    showIcon={false}
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                    })}
                    error={errors.confirmPassword?.message}
                />

                {/* Set Password Button */}
                <div className="pt-6">
                    <AuthButton
                        type="submit"
                        loading={loading || isSubmitting}
                        disabled={loading || isSubmitting}
                    >
                        {loading ? "Updating Password..." : "Set Password"}
                    </AuthButton>
                </div>
            </form>
        </AuthLayout>
    )
}


export default ResetPassword;