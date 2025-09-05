import { AuthButton } from "@/components/auth/AuthButton"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { InputWithIcon } from "@/components/auth/InputWithIcon"
import { SeparatorOR } from "@/components/auth/SeparatorOR"
import { SocialButton } from "@/components/auth/SocialButton"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

function OTP() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    // const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        console.log(data)
        setLoading(true)

        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // toast({
        //     title: "Success",
        //     description: "Code verified successfully!",
        // })

        setLoading(false)
        navigate("/auth/reset-password")
    }

    const handleSocialLogin = () => {
        // toast({
        //     title: "Social Login",
        //     description: `${provider} login would be implemented here`,
        // })
    }

    return (
        <AuthLayout
            showBack={true}
            bgImage={"/images/bg-otp.jpg"}
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Type The
                    <span className="text-primary-50"> Code </span>{" "}
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">Enter the email address or mobile phone number associated with your Food Port account.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Code Input */}
                <InputWithIcon
                    type="text"
                    placeholder="Type The Code"
                    {...register("code", {
                        required: "Verification code is required",
                        pattern: {
                            value: /^\d{4,6}$/,
                            message: "Please enter a valid verification code",
                        },
                    })}
                    error={errors.code?.message}
                />

                {/* Next Button */}
                <div className="pt-2">
                    <AuthButton type="submit" loading={loading}>
                        Next
                    </AuthButton>
                </div>

                <SeparatorOR />

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <SocialButton provider="facebook" onClick={() => handleSocialLogin("Facebook")} />
                    <SocialButton provider="google" onClick={() => handleSocialLogin("Google")} />
                </div>
            </form>
        </AuthLayout>
    )
}


export default OTP;