import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputWithIcon } from "@/components/auth/InputWithIcon";
import { SeparatorOR } from "@/components/auth/SeparatorOR";
import { SocialButton } from "@/components/auth/SocialButton";
import { Mail } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "@/hooks/api";
function ForgotPassword() {
  const navigate = useNavigate();

  const forgotPassword = useForgotPassword({
    onSuccess: (data) => {
      reset();
      navigate("/auth/otp");
    },
    onError: (error) => {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = useCallback(
    (data) => {
      const payload = {
        email: data.email,
      };
      forgotPassword.mutate(payload);
    },
    [forgotPassword]
  );
  return (
    <AuthLayout showBack={true} bgImage={"/images/bg-login.jpg"}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          <span className="text-primary-50">Reset </span> Password
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Enter the email address or mobile phone number associated with your
          Food Port account.
        </p>
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

        {/* Send Code Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={forgotPassword.isPending}
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? "Sending..." : "Send Code"}
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
  );
}

export default ForgotPassword;
