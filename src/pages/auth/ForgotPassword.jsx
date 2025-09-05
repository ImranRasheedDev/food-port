import { AuthButton } from '@/components/auth/AuthButton';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { InputWithIcon } from '@/components/auth/InputWithIcon';
import { SeparatorOR } from '@/components/auth/SeparatorOR';
import { SocialButton } from '@/components/auth/SocialButton';
import { Mail, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        // Validate that at least one field is filled
        if (!data.email && !data.phone) {
            toast.success({
                title: "Error",
                description: "Please enter either email or phone number",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLoading(false)
        navigate("/auth/otp")
    }

    return (
        <AuthLayout
            showBack={true}
            bgImage={"/images/bg-login.jpg"}
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    <span className="text-primary-50">Reset </span>{" "}
                    Password
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">Enter the email address or mobile phone number associated with your Food Port account.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <InputWithIcon
                    type="email"
                    placeholder="Enter Your Email"
                    icon={<Mail className="w-5 h-5" />}
                    {...register("email", {
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Please enter a valid email address",
                        },
                    })}
                    error={errors.email?.message}
                />

                {/* Phone Input */}
                <InputWithIcon
                    type="tel"
                    placeholder="Number"
                    icon={<Phone className="w-5 h-5" />}
                    {...register("phone", {
                        pattern: {
                            value: /^\d{7,15}$/,
                            message: "Please enter a valid phone number (7-15 digits)",
                        },
                    })}
                    error={errors.phone?.message}
                />

                {/* Send Code Button */}
                <div className="pt-2">
                    <AuthButton type="submit" loading={loading}>
                        Send Code
                    </AuthButton>
                </div>

                <SeparatorOR />

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <SocialButton provider="facebook" />
                    <SocialButton provider="google" />
                </div>
            </form>
        </AuthLayout>
    )
}


export default ForgotPassword;