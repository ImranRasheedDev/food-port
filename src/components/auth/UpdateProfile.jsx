import React, { useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "@/hooks/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { processImageUrl } from "@/lib/utils";
  
const VALIDATION_PATTERNS = {
  phone: /^[\d]{10,15}$/, // 10-15 digits
  countryCode: /^\d{1,4}$/, // up to 4 digits
};

const UpdateProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: window.user?.name || "",
      email: window.user?.email || "",
      number: window.user?.number || "",
      country_code: window.user?.country_code || "",
      dob: window.user?.dob || "",
      gender: window.user?.gender?.id || "",
    },
  });

  const isSubmittingRef = useRef(false);

  // hook
  const updateUser = useUpdateUser({
    onSuccess: async (data) => {
      isSubmittingRef.current = false;
      const userData = data?.data || {};
      const access_token = window?.user?.access_token;
      const updatedUser = {
        ...userData,
        ...(access_token ? { access_token } : {}),
      };
      await window.helper.setStorageData("user", updatedUser);
      window.user = updatedUser;
      reset(userData);
    },
    onError: () => {
      isSubmittingRef.current = false;
    },
  });

  const onSubmit = useCallback(
    (data) => {
      if (updateUser.isPending || isSubmittingRef.current) return;

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
        number: data.number,
        country_code: data.country_code,
        dob: data.dob,
        gender: data.gender,
      };

      updateUser.mutate(payload);
    },
    [updateUser]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Account Setting</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image - Centered on mobile */}
          <div className="flex justify-center md:justify-start">
            <img
              src={processImageUrl("/images/all.jpg")}
              alt=""
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="text-primary-1008 font-normal mb-2 block"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="border w-full border-primary-1007 h-11 px-5"
                {...register("name", {
                  required: "Full Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-primary-1008 font-normal mb-2 block"
              >
                Email
              </label>
              <input
                type="email"
                disabled={true}
                id="email"
                className="border w-full border-primary-1007 h-11 px-5"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone + Country Code */}
            <div className="col-span-1 sm:col-span-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="country_code"
                    className="text-primary-1008 font-normal mb-2 block"
                  >
                    Country Code
                  </label>
                  <input
                    type="text"
                    id="country_code"
                    className="border w-full border-primary-1007 h-11 px-3"
                    {...register("country_code", {
                      required: "Country code is required",
                      pattern: {
                        value: VALIDATION_PATTERNS.countryCode,
                        message: "Please enter a valid country code (e.g., 92)",
                      },
                    })}
                  />
                  {errors.country_code && (
                    <p className="text-red-500 text-sm">
                      {errors.country_code.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="number"
                    className="text-primary-1008 font-normal mb-2 block"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="number"
                    className="border w-full border-primary-1007 h-11 px-5"
                    {...register("number", {
                      required: "Phone number is required",
                      pattern: {
                        value: VALIDATION_PATTERNS.phone,
                        message:
                          "Please enter a valid phone number (10-15 digits)",
                      },
                    })}
                  />
                  {errors.number && (
                    <p className="text-red-500 text-sm">
                      {errors.number.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* DOB */}
            <div>
              <label
                htmlFor="dob"
                className="text-primary-1008 font-normal mb-2 block"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="border w-full border-primary-1007 h-11 px-5"
                {...register("dob", {
                  required: "Date of Birth is required",
                })}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="text-primary-1008 font-normal mb-2 block"
              >
                Gender
              </label>
              <Select
                defaultValue={String(window.user?.gender?.id || "")}
                onValueChange={(val) =>
                  reset((prev) => ({ ...prev, gender: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Gender</SelectLabel>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Button */}
            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                className="bg-primary-50 text-white rounded-full px-12 py-3 inline-block w-full sm:w-auto cursor-pointer"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
