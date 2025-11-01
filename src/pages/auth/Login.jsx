import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputWithIcon } from "@/components/auth/InputWithIcon";
import { PasswordInput } from "@/components/auth/PasswordInput";
// import { SeparatorOR } from "@/components/auth/SeparatorOR";
// import { SocialButton } from "@/components/auth/SocialButton";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginUser } from "@/hooks/api";
import { getFcmToken } from "@/lib/generateFcmToken";
function Login() {
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const loginUser = useLoginUser({
    onSuccess: async (data) => {
      reset();
      await window.helper.setStorageData("user", data?.data);
      window.user = data?.data;

      // Check if user has address after login
      const hasAddress = !!(window.user && (
        (Array.isArray(window.user.addresses) && window.user.addresses.length > 0) ||
        window.user.address
      ));

      if (!hasAddress) {
        // Navigate to home with address modal flag
        navigate("/", { state: { showAddressModal: true } });
      } else {
        navigate("/");
      }
    },
    onError: (error) => { },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = useCallback(
    async (data) => {
      console.log("Starting login process...");

      const fcmToken = await getFcmToken();
      console.log("FCM Token result:", fcmToken);

      const payload = {
        email: data.email,
        password: data.password,
        fcm_token: fcmToken || "NO_TOKEN_GENERATED",
      };

      console.log("Login payload:", payload);
      loginUser.mutate(payload);
    },
    [loginUser]
  );

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login would be implemented here`);
  };

  return (
    <AuthLayout bgImage={"/images/bg-login.jpg"}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          <span className="text-primary-50">Reset </span> Welcome Back
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Social Login Buttons */}
        {/* <div className="space-y-3">
          <SocialButton
            provider="facebook"
            onClick={() => handleSocialLogin("Facebook")}
          />
          <SocialButton
            provider="google"
            onClick={() => handleSocialLogin("Google")}
          />
        </div> */}

        {/* <SeparatorOR /> */}

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
              message:
                "Password must contain at least one letter and one number",
            },
          })}
          error={errors.password?.message}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-[#D6071B] underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            loading={loginUser.isPending}
            disabled={loginUser.isPending}
          >
            {loginUser.isPending ? "Loging..." : "Login"}
          </AuthButton>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-[#D6071B] hover:underline font-medium"
            >
              Sign-up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
