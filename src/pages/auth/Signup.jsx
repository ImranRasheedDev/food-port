import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputWithIcon } from "@/components/auth/InputWithIcon";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useRegisterUser } from "@/hooks/api";

// Validation patterns
const VALIDATION_PATTERNS = {
  name: /^[A-Za-z\s\-']+$/,
  email: /^\S+@\S+\.\S+$/,
  password: /^.{8,}$/,
  phone: /^[\d]{10,15}$/,
  countryCode: /^\+\d{1,4}$/,
  dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
};

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      number: "",
      country_code: "+92",
      dob: "",
    },
  });

  const password = watch("password");
  const isSubmittingRef = useRef(false);

  // Initialize the register user mutation
  const registerUser = useRegisterUser({
    onSuccess: (data) => {
      isSubmittingRef.current = false;
      // Success message is automatically shown by the API hook
      // TODO: Redirect to login or dashboard after successful signup
      // navigate('/auth/login')
    },
    onError: (error) => {
      isSubmittingRef.current = false;
      // Error messages are automatically shown by the API hook
      console.error("Registration error:", error);
    },
  });

  const onSubmit = useCallback(
    (data) => {
      if (registerUser.isPending || isSubmittingRef.current) {
        console.log("Submission blocked - already in progress");
        return;
      }

      isSubmittingRef.current = true;

      // Transform the data to match the API payload structure
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        number: data.number,
        country_code: data.country_code,
        dob: data.dob,
      };

      console.log("Registration payload:", payload);
      registerUser.mutate(payload);
    },
    [registerUser]
  );

  return (
    <AuthLayout showBack={true} bgImage={"/images/bg-signup.jpg"}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Sign-up As <span className="text-primary-50">A User</span>
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <InputWithIcon
          id="name"
          type="text"
          placeholder="Full Name"
          icon={<User className="w-5 h-5" />}
          {...register("name", {
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
              message:
                "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)",
            },
          })}
          error={errors.name?.message}
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
            pattern: {
              value: VALIDATION_PATTERNS.password,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="password_confirmation"
          placeholder="Confirm Password"
          //   showIcon={false}
          {...register("password_confirmation", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.password_confirmation?.message}
        />

        {/* Country Code */}
        {/* <InputWithIcon
          id="country_code"
          type="text"
          placeholder="Country Code (e.g., +92)"
          icon={<Phone className="w-5 h-5" />}
          {...register("country_code", {
            required: "Country code is required",
            pattern: {
              value: VALIDATION_PATTERNS.countryCode,
              message: "Please enter a valid country code (e.g., +92)",
            },
          })}
          error={errors.country_code?.message}
        /> */}

        {/* Phone Number */}
        <InputWithIcon
          id="number"
          type="tel"
          placeholder="Phone Number "
          icon={<Phone className="w-5 h-5" />}
          {...register("number", {
            required: "Phone number is required",
            pattern: {
              value: VALIDATION_PATTERNS.phone,
              message: "Please enter a valid phone number (10-15 digits)",
            },
          })}
          error={errors.number?.message}
        />

        {/* Date of Birth */}
        <InputWithIcon
          id="dob"
          type="date"
          placeholder="Date of Birth"
          icon={<Calendar className="w-5 h-5" />}
          {...register("dob", {
            required: "Date of birth is required",
            pattern: {
              value: VALIDATION_PATTERNS.dateOfBirth,
              message: "Please enter a valid date",
            },
            validate: (value) => {
              const birthDate = new Date(value);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear(); // use let
              const monthDiff = today.getMonth() - birthDate.getMonth();

              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--; // now allowed
              }

              if (age < 13) {
                return "You must be at least 13 years old";
              }
              if (age > 120) {
                return "Please enter a valid birth year";
              }

              return true;
            },
          })}
          error={errors.dob?.message}
        />

        {/* Create Account Button */}
        <div className="pt-6">
          <AuthButton
            type="submit"
            loading={registerUser.isPending}
            disabled={registerUser.isPending}
          >
            {registerUser.isPending
              ? "Creating Account..."
              : "Create an account"}
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
  );
}

export default Signup;
