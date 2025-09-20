import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "@/hooks/api";

const VALIDATION_PATTERNS = {
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/,
};

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const code = location.state?.code;
  const resetPassword = useResetPassword({
    onSuccess: () => {
      reset();
      navigate("/auth/login");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = useCallback(
    (data) => {
      const payload = {
        email,
        code,
        password: data.password,
      };
      resetPassword.mutate(payload);
    },
    [resetPassword]
  );

  return (
    <AuthLayout showBack={true} bgImage={"/images/reset-password.jpg"}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          <span className="text-primary-50">New</span> Password
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Set your new password for your Food Port account.
        </p>
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
              message:
                "Password must contain at least one letter, one number, and one special character",
            },
          })}
          error={errors.password?.message}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm New Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        {/* Submit Button */}
        <div className="pt-6">
          <AuthButton
            type="submit"
            loading={resetPassword.isPending}
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? "Updating Password..." : "Set Password"}
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
