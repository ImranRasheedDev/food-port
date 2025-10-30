import React, { useRef, useCallback, useState, useEffect } from "react";
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
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
  
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
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: window.user?.name || "",
      email: window.user?.email || "",
      number: window.user?.number || "",
      country_code: window.user?.country_code || "",
      dob: window.user?.dob || "",
      gender: window.user?.gender?.id === 0 ? "0" : (window.user?.gender?.id ? String(window.user.gender.id) : "1"),
      image: window.user?.image || "",
    },
  });

  const isSubmittingRef = useRef(false);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    window.user?.image ? processImageUrl(window.user.image) : null
  );

  // Watch the gender field to debug
  const genderValue = watch('gender');
  console.log('Current gender value:', genderValue);
  console.log('Window.user.gender:', window.user?.gender);
  console.log('Window.user.gender.id:', window.user?.gender?.id);
  console.log('Current imagePreview:', imagePreview);
  console.log('Current window.user.image:', window.user?.image);

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Update image preview when component mounts or user changes
  useEffect(() => {
    console.log('User image on mount:', window.user?.image);
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    if (window.user?.image && !imagePreview) {
      // Clean the image path - remove escaped slashes
      const cleanImagePath = window.user.image.replace(/\\\//g, '/');
      console.log('Cleaned image path on mount:', cleanImagePath);
      
      // Try different approaches to construct the image URL
      let imageUrl;
      if (cleanImagePath.startsWith('http')) {
        // Already a full URL
        imageUrl = cleanImagePath;
      } else if (cleanImagePath.startsWith('/')) {
        // Static asset
        imageUrl = processImageUrl(cleanImagePath, "/images/avatar.jpg");
      }
      console.log('Constructed image URL:', imageUrl);
      setImagePreview(imageUrl || "/images/avatar.jpg");
    }
  }, []);

  // hook
  const updateUser = useUpdateUser({
    onSuccess: async (data) => {
      isSubmittingRef.current = false;
      const userData = data?.data || {};
      const access_token = window?.user?.access_token;
      
      // Preserve address and location data that might not be returned by API
      const preservedFields = {
        address: window.user?.address || "",
        user_address: window.user?.user_address || "",
        location: window.user?.location || "",
        latitude: window.user?.latitude || "",
        longitude: window.user?.longitude || "",
        city: window.user?.city || "",
        zip_code: window.user?.zip_code || "",
        address_data: window.user?.address_data || null,
      };
      
      // Merge with existing window.user to preserve address and other fields
      const updatedUser = {
        ...window.user, // Preserve existing fields like address, latitude, longitude, etc.
        ...userData,    // Overwrite with updated fields from API
        ...preservedFields, // Ensure address fields are preserved
        ...(access_token ? { access_token } : {}),
      };
      
      await window.helper.setStorageData("user", updatedUser);
      window.user = updatedUser;
      
      // Update image preview if new image is returned from server
      if (userData.image) {
        // Clean the image path - remove escaped slashes
        const cleanImagePath = userData.image.replace(/\\\//g, '/');
        console.log(' image path:', cleanImagePath);
        
        // Try different approaches to construct the image URL
        let imageUrl;
        if (cleanImagePath.startsWith('http')) {
          // Already a full URL
          imageUrl = cleanImagePath;
        } else if (cleanImagePath.startsWith('/')) {
          // Static asset
          imageUrl = processImageUrl(cleanImagePath);
        } else {
          // API image - construct manually
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
          imageUrl = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanImagePath}` : cleanImagePath;
        }
        console.log('Setting image preview to:', imageUrl);
        setImagePreview(imageUrl);
      } else {
        console.log('No image returned from server');
      }
      
      // Clear selected image since it's now saved
      setSelectedImage(null);
      
      // Dispatch custom event to notify other components of user update
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      // Show success toast after all operations complete
      
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

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('number', data.number);
      formData.append('country_code', data.country_code);
      formData.append('dob', data.dob);
      
      // Handle gender - ensure it's a valid number
      // Convert string value to number (1 = Male, 0 = Female)
      let genderNumber;
      const genderValue = data.gender;
      
      if (genderValue === '1' || genderValue === 1) {
        genderNumber = 1; // Male
      } else if (genderValue === '0' || genderValue === 0) {
        genderNumber = 0; // Female
      } else {
        // Default to existing gender or Male if not set
        genderNumber = window.user?.gender?.id !== undefined ? window.user.gender.id : 1;
      }
      
      console.log('Gender conversion:', { input: genderValue, output: genderNumber, type: typeof genderNumber });
      formData.append('gender', genderNumber);
      
      console.log('Form data being sent:', {
        name: data.name,
        email: data.email,
        number: data.number,
        country_code: data.country_code,
        dob: data.dob,
        gender: genderNumber,
        genderType: typeof genderNumber,
        hasImage: !!selectedImage
      });
      
      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      updateUser.mutate(formData);
    },
    [updateUser, selectedImage]
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Account Setting</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image - Centered on mobile */}
          <div className="flex justify-center md:justify-start">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <img
                src={imagePreview || (window.user?.image ? (() => {
                  // Clean the image path - remove escaped slashes
                  const cleanImagePath = window.user.image.replace(/\\\//g, '/');
                  console.log('Image display - cleanImagePath:', cleanImagePath);
                  if (cleanImagePath.startsWith('http')) {
                    return cleanImagePath;
                  } else if (cleanImagePath.startsWith('/')) {
                    return processImageUrl(cleanImagePath);
                  } else {
                    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
                    const fullUrl = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanImagePath}` : cleanImagePath;
                    console.log('Image display - fullUrl:', fullUrl);
                    return fullUrl;
                  }
                })() : processImageUrl("/images/avatar.jpg" ))}
                alt="Profile"
                className="w-32 h-32 md:w-32 md:h-32 rounded-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = processImageUrl("/images/avatar.jpg");
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully:', e.target.src);
                }}
              />
              {/* Camera icon overlay on hover */}
              <div className="absolute inset-0 w-32 h-32 md:w-32 md:h-32 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
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
                value={watch('gender') || String(window.user?.gender?.id === 0 ? '0' : (window.user?.gender?.id || '1'))}
                onValueChange={(val) => {
                  setValue('gender', val);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Gender</SelectLabel>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="0">Female</SelectItem>
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
