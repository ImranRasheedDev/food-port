import React, { useRef, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useApiMutation } from "@/hooks/api";
import { Eye, EyeOff, Lock } from "lucide-react";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSubmittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");

  const changePasswordMutation = useApiMutation("/change-password", {
    onSuccess: (data) => {
      isSubmittingRef.current = false;
      reset();
    },
    onError: (error) => {
      isSubmittingRef.current = false;
      if (error?.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field, { type: "server", message: messages[0] });
          }
        });
      }
    },
  });

  const onSubmit = useCallback(
    (data) => {
      if (changePasswordMutation.isPending || isSubmittingRef.current) return;

      isSubmittingRef.current = true;

      changePasswordMutation.mutate({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
    },
    [changePasswordMutation]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-md space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current_password"
              className="text-primary-1008 font-normal mb-2 block"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="current_password"
                placeholder="Enter current password"
                className="border w-full border-primary-1007 h-11 px-5 pr-12"
                {...register("current_password", {
                  required: "Current password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.current_password.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="text-primary-1008 font-normal mb-2 block"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                className="border w-full border-primary-1007 h-11 px-5 pr-12"
                {...register("password", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="password_confirmation"
              className="text-primary-1008 font-normal mb-2 block"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password_confirmation"
                placeholder="Confirm new password"
                className="border w-full border-primary-1007 h-11 px-5 pr-12"
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-primary-50 text-white rounded-full px-12 py-3 inline-block w-full sm:w-auto cursor-pointer"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
