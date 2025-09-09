import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputWithIcon } from "@/components/auth/InputWithIcon";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser } from "@/hooks/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Validation patterns
const VALIDATION_PATTERNS = {
  name: /^[A-Za-z\s\-']+$/,
  email: /^\S+@\S+\.\S+$/,
  password: /^.{8,}$/,
  phone: /^[\d]{10,15}$/,
  countryCode: /^\d{1,4}$/,
  dateOfBirth: /^\d{4}-\d{2}-\d{2}$/,
};

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      number: "",
      country_code: "",
      dob: "",
      gender: "",
    },
  });
  const navigate = useNavigate();
  const password = watch("password");
  const isSubmittingRef = useRef(false);

  // Initialize the register user mutation
  const registerUser = useRegisterUser({
    onSuccess: async (data) => {
      isSubmittingRef.current = false;
      reset();
      await window.helper.setStorageData("user", data?.data);
      window.user = data?.data;
      navigate("/");
    },
    onError: (error) => {
      isSubmittingRef.current = false;
    },
  });

  const onSubmit = useCallback(
    (data) => {
      if (registerUser.isPending || isSubmittingRef.current) {
        return;
      }

      isSubmittingRef.current = true;

      let phone = data.number.replace(/\D/g, ""); // sirf digits
      let country_code = "";
      let number = "";

      if (phone.length > 10) {
        country_code = phone.slice(0, phone.length - 10); // prefix as country code
        number = phone.slice(phone.length - 10); // last 10 digits as local number
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        number: data.number,
        country_code: data.country_code,
        dob: data.dob,
        gender: 1,
      };

      console.log("Final Payload:", payload);
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
        <div className="flex gap-2">
          <div className="basis-1/4">
            <InputWithIcon
              id="country_code"
              type="text"
              placeholder="Country Code (e.g., 92)"
              icon={<Phone className="w-5 h-5" />}
              {...register("country_code", {
                required: "Country code is required",
                pattern: {
                  value: VALIDATION_PATTERNS.countryCode,
                  message: "Please enter a valid country code (e.g., +92)",
                },
              })}
              error={errors.country_code?.message}
            />
          </div>
          <div className="basis-3/4">
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
          </div>
        </div>
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
          })}
          error={errors.dob?.message}
        />
        <Select>
          <SelectTrigger className="w-[100]">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Gender</SelectLabel>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
