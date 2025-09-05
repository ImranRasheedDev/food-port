import { AuthButton } from "@/components/auth/AuthButton"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { InputWithIcon } from "@/components/auth/InputWithIcon"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { SeparatorOR } from "@/components/auth/SeparatorOR"
import { SocialButton } from "@/components/auth/SocialButton"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

function Login() {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setLoading(true)
        console.log(data)
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        toast.success("Logged in successfully!")

        setLoading(false)
    }

    const handleSocialLogin = (provider) => {
        toast.info(`${provider} login would be implemented here`)
    }

    return (
        <AuthLayout bgImage={'/images/bg-login.jpg'}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    <span className="text-primary-50">Reset </span>{" "}
                    Welcome Back
                </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <SocialButton provider="facebook" onClick={() => handleSocialLogin("Facebook")} />
                    <SocialButton provider="google" onClick={() => handleSocialLogin("Google")} />
                </div>

                <SeparatorOR />

                {/* Email Input */}
                <InputWithIcon
                    type="email"
                    placeholder="Enter Your Email Address"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Please enter a valid email address",
                        },
                    })}
                    error={errors.email?.message}
                />

                {/* Password Input */}
                <PasswordInput
                    placeholder="Enter Your Password"
                    showIcon={false}
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)/,
                            message: "Password must contain at least one letter and one number",
                        },
                    })}
                    error={errors.password?.message}
                />

                {/* Forgot Password Link */}
                <div className="text-right">
                    <Link to="/auth/forgot-password" className="text-sm text-[#D6071B] underline">
                        Forgot Password?
                    </Link>
                </div>

                {/* Login Button */}
                <div className="pt-2">
                    <AuthButton type="submit" loading={loading}>
                        Login
                    </AuthButton>
                </div>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/auth/signup" className="text-[#D6071B] hover:underline font-medium">
                            Sign-up
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}

export default Login;