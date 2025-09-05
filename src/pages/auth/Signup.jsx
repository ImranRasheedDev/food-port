import { AuthButton } from '@/components/auth/AuthButton'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { InputWithIcon } from '@/components/auth/InputWithIcon'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

// Validation patterns
const VALIDATION_PATTERNS = {
    name: /^[A-Za-z\s\-']+$/,
    email: /^\S+@\S+\.\S+$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/,
    phone: /^\+?[\d\s\-()]{10,15}$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    dateOfBirth: /^\d{2}\/\d{2}\/\d{2}$/,
}

function Signup() {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            dateOfBirth: '',
        }
    })

    const password = watch("password")

    const onSubmit = useCallback(async (data) => {
        if (isSubmitting) return

        setLoading(true)

        try {
            // Validate all required fields
            const requiredFields = ['fullName', 'email', 'password', 'confirmPassword', 'phone', 'address', 'city', 'zipCode', 'dateOfBirth']
            const missingFields = requiredFields.filter(field => !data[field]?.trim())

            if (missingFields.length > 0) {
                toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
                return
            }

            console.log('Signup data:', data)
            // Mock API call - replace with actual API when available
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast.success("Account created successfully!")

            // TODO: Redirect to login or dashboard after successful signup
            // navigate('/auth/login')
        } catch (error) {
            console.error('Signup error:', error)
            toast.error("Failed to create account. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [isSubmitting])

    return (
        <AuthLayout showBack={true} bgImage={'/images/bg-signup.jpg'} >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Sign-up As{" "}
                    <span className="text-primary-50">A User</span>
                </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <InputWithIcon
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    icon={<User className="w-5 h-5" />}
                    {...register("fullName", {
                        required: "Full name is required",
                        minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                            value: 50,
                            message: "Name must be less than 50 characters",
                        },
                        pattern: {
                            value: VALIDATION_PATTERNS.name,
                            message: "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)",
                        },
                    })}
                    error={errors.fullName?.message}
                />

                {/* Email */}
                <InputWithIcon
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    icon={<Mail className="w-5 h-5" />}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: VALIDATION_PATTERNS.email,
                            message: "Please enter a valid email address",
                        },
                    })}
                    error={errors.email?.message}
                />

                {/* Password */}
                <PasswordInput
                    id="password"
                    placeholder="Set a Password"
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
                    placeholder="Confirm Password"
                    showIcon={false}
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                    })}
                    error={errors.confirmPassword?.message}
                />

                {/* Phone Number */}
                <InputWithIcon
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    icon={<Phone className="w-5 h-5" />}
                    {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                            value: VALIDATION_PATTERNS.phone,
                            message: "Please enter a valid phone number",
                        },
                    })}
                    error={errors.phone?.message}
                />

                {/* Address */}
                <InputWithIcon
                    id="address"
                    type="text"
                    placeholder="Address"
                    icon={<MapPin className="w-5 h-5" />}
                    {...register("address", {
                        required: "Address is required",
                        minLength: {
                            value: 5,
                            message: "Address must be at least 5 characters",
                        },
                        maxLength: {
                            value: 100,
                            message: "Address must be less than 100 characters",
                        },
                    })}
                    error={errors.address?.message}
                />

                {/* City */}
                <InputWithIcon
                    id="city"
                    type="text"
                    placeholder="City"
                    icon={<MapPin className="w-5 h-5" />}
                    {...register("city", {
                        required: "City is required",
                        minLength: {
                            value: 2,
                            message: "City must be at least 2 characters",
                        },
                        pattern: {
                            value: VALIDATION_PATTERNS.name,
                            message: "Please enter a valid city name",
                        },
                    })}
                    error={errors.city?.message}
                />

                {/* Zip Code */}
                <InputWithIcon
                    id="zipCode"
                    type="text"
                    placeholder="Zip Code"
                    icon={<MapPin className="w-5 h-5" />}
                    {...register("zipCode", {
                        required: "Zip code is required",
                        pattern: {
                            value: VALIDATION_PATTERNS.zipCode,
                            message: "Please enter a valid zip code (e.g., 12345 or 12345-6789)",
                        },
                    })}
                    error={errors.zipCode?.message}
                />

                {/* Date of Birth */}
                <InputWithIcon
                    id="dateOfBirth"
                    type="text"
                    placeholder="Date of Birth (YY/MM/DD)"
                    icon={<Calendar className="w-5 h-5" />}
                    {...register("dateOfBirth", {
                        required: "Date of birth is required",
                        pattern: {
                            value: VALIDATION_PATTERNS.dateOfBirth,
                            message: "Please enter date in YY/MM/DD format",
                        },
                        validate: (value) => {
                            const [year, month, day] = value.split('/').map(Number)
                            const currentYear = new Date().getFullYear() % 100
                            const fullYear = year <= currentYear ? 2000 + year : 1900 + year
                            const date = new Date(fullYear, month - 1, day)

                            if (date.getMonth() !== month - 1 || date.getDate() !== day) {
                                return "Please enter a valid date"
                            }

                            const age = new Date().getFullYear() - fullYear
                            if (age < 13) {
                                return "You must be at least 13 years old"
                            }
                            if (age > 120) {
                                return "Please enter a valid birth year"
                            }

                            return true
                        },
                    })}
                    error={errors.dateOfBirth?.message}
                />

                {/* Create Account Button */}
                <div className="pt-6">
                    <AuthButton
                        type="submit"
                        loading={loading || isSubmitting}
                        disabled={loading || isSubmitting}
                    >
                        {loading ? "Creating Account..." : "Create an account"}
                    </AuthButton>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="text-[#D6071B] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Signup;