import React, { useRef, useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Camera, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { InputWithIcon } from "@/components/auth/InputWithIcon";

const VALIDATION_PATTERNS = {
  phone: /^[\d]{10,15}$/, // 10-15 digits
  countryCode: /^\d{1,4}$/, // up to 4 digits
};

const UpdateProfile = () => {
  // Split full name into first and last name
  const fullName = window.user?.name || "";
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: window.user?.email || "",
      number: window.user?.number || "",
      country_code: window.user?.country_code || "",
      dob: window.user?.dob || "",
      gender: window.user?.gender?.id ? String(window.user.gender.id) : "1",
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

      console.log('=== UpdateProfile: Profile update successful ===');
      console.log('UpdateProfile: API response data:', userData);

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

      console.log('UpdateProfile: Preserved address fields:', preservedFields);

      // Merge with existing window.user to preserve address and other fields
      const updatedUser = {
        ...window.user, // Preserve existing fields like address, latitude, longitude, etc.
        ...userData,    // Overwrite with updated fields from API
        ...preservedFields, // Ensure address fields are preserved
        ...(access_token ? { access_token } : {}),
      };

      console.log('UpdateProfile: Updated user object:', updatedUser);
      console.log('UpdateProfile: Updated user name:', updatedUser.name);
      console.log('UpdateProfile: Updated user image:', updatedUser.image);
      console.log('UpdateProfile: Updated user address:', updatedUser.address);

      // Save to storage first
      await window.helper.setStorageData("user", updatedUser);

      // Then update window.user
      window.user = updatedUser;

      // Update image preview if new image is returned from server
      if (userData.image) {
        // Clean the image path - remove escaped slashes
        const cleanImagePath = userData.image.replace(/\\\//g, '/');
        console.log('UpdateProfile: Cleaned image path:', cleanImagePath);

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
        console.log('UpdateProfile: Setting image preview to:', imageUrl);
        setImagePreview(imageUrl);
      } else {
        console.log('UpdateProfile: No image returned from server');
      }

      // Clear selected image since it's now saved
      setSelectedImage(null);

      // Dispatch custom event to notify other components of user update
      console.log('UpdateProfile: Dispatching userUpdated event with data:', updatedUser);
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      console.log('UpdateProfile: userUpdated event dispatched');

      // Split the updated name for form reset (like initial load)
      const updatedFullName = userData.name || "";
      const updatedNameParts = updatedFullName.trim().split(" ");
      const updatedFirstName = updatedNameParts[0] || "";
      const updatedLastName = updatedNameParts.slice(1).join(" ") || "";

      reset({
        first_name: updatedFirstName,
        last_name: updatedLastName,
        email: userData.email,
        number: userData.number,
        country_code: userData.country_code,
        dob: userData.dob,
        gender: userData.gender?.id ? String(userData.gender.id) : "1",
        image: userData.image || "",
      });

      console.log('=== UpdateProfile: Profile update complete ===');
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

      // Concatenate first name and last name into single name field (like Signup.jsx)
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('email', data.email);
      formData.append('number', data.number);
      formData.append('country_code', data.country_code);
      formData.append('dob', data.dob);

      // Handle gender - ensure it's a valid number
      // Convert string value to number (1 = Male, 2 = Female) - matches Signup.jsx
      let genderNumber;
      const genderValue = data.gender;

      if (genderValue === '1' || genderValue === 1) {
        genderNumber = 1; // Male
      } else if (genderValue === '2' || genderValue === 2) {
        genderNumber = 2; // Female
      } else {
        // Default to existing gender or Male if not set
        genderNumber = window.user?.gender?.id !== undefined ? window.user.gender.id : 1;
      }

      console.log('Gender conversion:', { input: genderValue, output: genderNumber, type: typeof genderNumber });
      formData.append('gender', genderNumber);

      console.log('Form data being sent:', {
        name: fullName,
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
          <div>
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
                  })() : processImageUrl("/images/avatar.jpg"))}
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
                <div className="absolute inset-0 w-32 h-32 md:w-32 md:h-32 bg-black/50 bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {/* First Name */}
            <div>
              <label
                htmlFor="first_name"
                className="text-primary-1008 font-normal mb-2 block"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                className="border w-full border-primary-1007 h-11 px-5"
                {...register("first_name", {
                  required: "First Name is required",
                })}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="last_name"
                className="text-primary-1008 font-normal mb-2 block"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                className="border w-full border-primary-1007 h-11 px-5"
                {...register("last_name", {
                  required: "Last Name is required",
                })}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name.message}</p>
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
                readOnly={true}
                id="email"
                className="border w-full border-primary-1007 h-11 px-5 cursor-not-allowed opacity-50"
                value={window.user?.email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone + Country Code */}
            <div className="flex gap-2">
              <div className="basis-1/4">
                <label
                  htmlFor="country_code"
                  className="text-primary-1008 font-normal mb-2 block"
                >
                  Country Code
                </label>
                <Controller
                  name="country_code"
                  control={control}
                  rules={{ required: "Country code is required" }}
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setTimeout(() => {
                            if (!value) {
                              field.onBlur();
                            }
                          }, 0);
                        }}
                      >
                        <SelectTrigger
                          className={`w-full h-11! rounded-none border border-primary-1007 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : ''
                            }`}
                          aria-invalid={fieldState.error ? "true" : "false"}
                          aria-describedby={fieldState.error ? "country-code-error" : undefined}
                        >
                          <SelectValue placeholder="+1" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectGroup>
                            <SelectLabel>Country Code</SelectLabel>
                            <SelectItem value="1">🇺🇸 +1</SelectItem>
                            <SelectItem value="44">🇬🇧 +44</SelectItem>
                            <SelectItem value="91">🇮🇳 +91</SelectItem>
                            <SelectItem value="92">🇵🇰 +92</SelectItem>
                            <SelectItem value="93">🇦🇫 +93</SelectItem>
                            <SelectItem value="94">🇱🇰 +94</SelectItem>
                            <SelectItem value="95">🇲🇲 +95</SelectItem>
                            <SelectItem value="98">🇮🇷 +98</SelectItem>
                            <SelectItem value="20">🇪🇬 +20</SelectItem>
                            <SelectItem value="27">🇿🇦 +27</SelectItem>
                            <SelectItem value="30">🇬🇷 +30</SelectItem>
                            <SelectItem value="31">🇳🇱 +31</SelectItem>
                            <SelectItem value="32">🇧🇪 +32</SelectItem>
                            <SelectItem value="33">🇫🇷 +33</SelectItem>
                            <SelectItem value="34">🇪🇸 +34</SelectItem>
                            <SelectItem value="36">🇭🇺 +36</SelectItem>
                            <SelectItem value="39">🇮🇹 +39</SelectItem>
                            <SelectItem value="40">🇷🇴 +40</SelectItem>
                            <SelectItem value="41">🇨🇭 +41</SelectItem>
                            <SelectItem value="43">🇦🇹 +43</SelectItem>
                            <SelectItem value="45">🇩🇰 +45</SelectItem>
                            <SelectItem value="46">🇸🇪 +46</SelectItem>
                            <SelectItem value="47">🇳🇴 +47</SelectItem>
                            <SelectItem value="48">🇵🇱 +48</SelectItem>
                            <SelectItem value="49">🇩🇪 +49</SelectItem>
                            <SelectItem value="51">🇵🇪 +51</SelectItem>
                            <SelectItem value="52">🇲🇽 +52</SelectItem>
                            <SelectItem value="53">🇨🇺 +53</SelectItem>
                            <SelectItem value="54">🇦🇷 +54</SelectItem>
                            <SelectItem value="55">🇧🇷 +55</SelectItem>
                            <SelectItem value="56">🇨🇱 +56</SelectItem>
                            <SelectItem value="57">🇨🇴 +57</SelectItem>
                            <SelectItem value="58">🇻🇪 +58</SelectItem>
                            <SelectItem value="60">🇲🇾 +60</SelectItem>
                            <SelectItem value="61">🇦🇺 +61</SelectItem>
                            <SelectItem value="62">🇮🇩 +62</SelectItem>
                            <SelectItem value="63">🇵🇭 +63</SelectItem>
                            <SelectItem value="64">🇳🇿 +64</SelectItem>
                            <SelectItem value="65">🇸🇬 +65</SelectItem>
                            <SelectItem value="66">🇹🇭 +66</SelectItem>
                            <SelectItem value="81">🇯🇵 +81</SelectItem>
                            <SelectItem value="82">🇰🇷 +82</SelectItem>
                            <SelectItem value="84">🇻🇳 +84</SelectItem>
                            <SelectItem value="86">🇨🇳 +86</SelectItem>
                            <SelectItem value="90">🇹🇷 +90</SelectItem>
                            <SelectItem value="212">🇲🇦 +212</SelectItem>
                            <SelectItem value="213">🇩🇿 +213</SelectItem>
                            <SelectItem value="216">🇹🇳 +216</SelectItem>
                            <SelectItem value="218">🇱🇾 +218</SelectItem>
                            <SelectItem value="220">🇬🇲 +220</SelectItem>
                            <SelectItem value="221">🇸🇳 +221</SelectItem>
                            <SelectItem value="222">🇲🇷 +222</SelectItem>
                            <SelectItem value="223">🇲🇱 +223</SelectItem>
                            <SelectItem value="224">🇬🇳 +224</SelectItem>
                            <SelectItem value="225">🇨🇮 +225</SelectItem>
                            <SelectItem value="226">🇧🇫 +226</SelectItem>
                            <SelectItem value="227">🇳🇪 +227</SelectItem>
                            <SelectItem value="228">🇹🇬 +228</SelectItem>
                            <SelectItem value="229">🇧🇯 +229</SelectItem>
                            <SelectItem value="230">🇲🇺 +230</SelectItem>
                            <SelectItem value="231">🇱🇷 +231</SelectItem>
                            <SelectItem value="232">🇸🇱 +232</SelectItem>
                            <SelectItem value="233">🇬🇭 +233</SelectItem>
                            <SelectItem value="234">🇳🇬 +234</SelectItem>
                            <SelectItem value="235">🇹🇩 +235</SelectItem>
                            <SelectItem value="236">🇨🇫 +236</SelectItem>
                            <SelectItem value="237">🇨🇲 +237</SelectItem>
                            <SelectItem value="238">🇨🇻 +238</SelectItem>
                            <SelectItem value="239">🇸🇹 +239</SelectItem>
                            <SelectItem value="240">🇬🇶 +240</SelectItem>
                            <SelectItem value="241">🇬🇦 +241</SelectItem>
                            <SelectItem value="242">🇨🇬 +242</SelectItem>
                            <SelectItem value="243">🇨🇩 +243</SelectItem>
                            <SelectItem value="244">🇦🇴 +244</SelectItem>
                            <SelectItem value="245">🇬🇼 +245</SelectItem>
                            <SelectItem value="246">🇮🇴 +246</SelectItem>
                            <SelectItem value="248">🇸🇨 +248</SelectItem>
                            <SelectItem value="249">🇸🇩 +249</SelectItem>
                            <SelectItem value="250">🇷🇼 +250</SelectItem>
                            <SelectItem value="251">🇪🇹 +251</SelectItem>
                            <SelectItem value="252">🇸🇴 +252</SelectItem>
                            <SelectItem value="253">🇩🇯 +253</SelectItem>
                            <SelectItem value="254">🇰🇪 +254</SelectItem>
                            <SelectItem value="255">🇹🇿 +255</SelectItem>
                            <SelectItem value="256">🇺🇬 +256</SelectItem>
                            <SelectItem value="257">🇧🇮 +257</SelectItem>
                            <SelectItem value="258">🇲🇿 +258</SelectItem>
                            <SelectItem value="260">🇿🇲 +260</SelectItem>
                            <SelectItem value="261">🇲🇬 +261</SelectItem>
                            <SelectItem value="262">🇷🇪 +262</SelectItem>
                            <SelectItem value="263">🇿🇼 +263</SelectItem>
                            <SelectItem value="264">🇳🇦 +264</SelectItem>
                            <SelectItem value="265">🇲🇼 +265</SelectItem>
                            <SelectItem value="266">🇱🇸 +266</SelectItem>
                            <SelectItem value="267">🇧🇼 +267</SelectItem>
                            <SelectItem value="268">🇸🇿 +268</SelectItem>
                            <SelectItem value="269">🇰🇲 +269</SelectItem>
                            <SelectItem value="290">🇸🇭 +290</SelectItem>
                            <SelectItem value="291">🇪🇷 +291</SelectItem>
                            <SelectItem value="297">🇦🇼 +297</SelectItem>
                            <SelectItem value="298">🇫🇴 +298</SelectItem>
                            <SelectItem value="299">🇬🇱 +299</SelectItem>
                            <SelectItem value="350">🇬🇮 +350</SelectItem>
                            <SelectItem value="351">🇵🇹 +351</SelectItem>
                            <SelectItem value="352">🇱🇺 +352</SelectItem>
                            <SelectItem value="353">🇮🇪 +353</SelectItem>
                            <SelectItem value="354">🇮🇸 +354</SelectItem>
                            <SelectItem value="355">🇦🇱 +355</SelectItem>
                            <SelectItem value="356">🇲🇹 +356</SelectItem>
                            <SelectItem value="357">🇨🇾 +357</SelectItem>
                            <SelectItem value="358">🇫🇮 +358</SelectItem>
                            <SelectItem value="359">🇧🇬 +359</SelectItem>
                            <SelectItem value="370">🇱🇹 +370</SelectItem>
                            <SelectItem value="371">🇱🇻 +371</SelectItem>
                            <SelectItem value="372">🇪🇪 +372</SelectItem>
                            <SelectItem value="373">🇲🇩 +373</SelectItem>
                            <SelectItem value="374">🇦🇲 +374</SelectItem>
                            <SelectItem value="375">🇧🇾 +375</SelectItem>
                            <SelectItem value="376">🇦🇩 +376</SelectItem>
                            <SelectItem value="377">🇲🇨 +377</SelectItem>
                            <SelectItem value="378">🇸🇲 +378</SelectItem>
                            <SelectItem value="380">🇺🇦 +380</SelectItem>
                            <SelectItem value="381">🇷🇸 +381</SelectItem>
                            <SelectItem value="382">🇲🇪 +382</SelectItem>
                            <SelectItem value="383">🇽🇰 +383</SelectItem>
                            <SelectItem value="385">🇭🇷 +385</SelectItem>
                            <SelectItem value="386">🇸🇮 +386</SelectItem>
                            <SelectItem value="387">🇧🇦 +387</SelectItem>
                            <SelectItem value="389">🇲🇰 +389</SelectItem>
                            <SelectItem value="420">🇨🇿 +420</SelectItem>
                            <SelectItem value="421">🇸🇰 +421</SelectItem>
                            <SelectItem value="423">🇱🇮 +423</SelectItem>
                            <SelectItem value="500">🇫🇰 +500</SelectItem>
                            <SelectItem value="501">🇧🇿 +501</SelectItem>
                            <SelectItem value="502">🇬🇹 +502</SelectItem>
                            <SelectItem value="503">🇸🇻 +503</SelectItem>
                            <SelectItem value="504">🇭🇳 +504</SelectItem>
                            <SelectItem value="505">🇳🇮 +505</SelectItem>
                            <SelectItem value="506">🇨🇷 +506</SelectItem>
                            <SelectItem value="507">🇵🇦 +507</SelectItem>
                            <SelectItem value="508">🇵🇲 +508</SelectItem>
                            <SelectItem value="509">🇭🇹 +509</SelectItem>
                            <SelectItem value="590">🇬🇵 +590</SelectItem>
                            <SelectItem value="591">🇧🇴 +591</SelectItem>
                            <SelectItem value="592">🇬🇾 +592</SelectItem>
                            <SelectItem value="593">🇪🇨 +593</SelectItem>
                            <SelectItem value="594">🇬🇫 +594</SelectItem>
                            <SelectItem value="595">🇵🇾 +595</SelectItem>
                            <SelectItem value="596">🇲🇶 +596</SelectItem>
                            <SelectItem value="597">🇸🇷 +597</SelectItem>
                            <SelectItem value="598">🇺🇾 +598</SelectItem>
                            <SelectItem value="599">🇨🇼 +599</SelectItem>
                            <SelectItem value="670">🇹🇱 +670</SelectItem>
                            <SelectItem value="672">🇦🇶 +672</SelectItem>
                            <SelectItem value="673">🇧🇳 +673</SelectItem>
                            <SelectItem value="674">🇳🇷 +674</SelectItem>
                            <SelectItem value="675">🇵🇬 +675</SelectItem>
                            <SelectItem value="676">🇹🇴 +676</SelectItem>
                            <SelectItem value="677">🇸🇧 +677</SelectItem>
                            <SelectItem value="678">🇻🇺 +678</SelectItem>
                            <SelectItem value="679">🇫🇯 +679</SelectItem>
                            <SelectItem value="680">🇵🇼 +680</SelectItem>
                            <SelectItem value="681">🇼🇫 +681</SelectItem>
                            <SelectItem value="682">🇨🇰 +682</SelectItem>
                            <SelectItem value="683">🇳🇺 +683</SelectItem>
                            <SelectItem value="685">🇼🇸 +685</SelectItem>
                            <SelectItem value="686">🇰🇮 +686</SelectItem>
                            <SelectItem value="687">🇳🇨 +687</SelectItem>
                            <SelectItem value="688">🇹🇻 +688</SelectItem>
                            <SelectItem value="689">🇵🇫 +689</SelectItem>
                            <SelectItem value="690">🇹🇰 +690</SelectItem>
                            <SelectItem value="691">🇫🇲 +691</SelectItem>
                            <SelectItem value="692">🇲🇭 +692</SelectItem>
                            <SelectItem value="850">🇰🇵 +850</SelectItem>
                            <SelectItem value="852">🇭🇰 +852</SelectItem>
                            <SelectItem value="853">🇲🇴 +853</SelectItem>
                            <SelectItem value="855">🇰🇭 +855</SelectItem>
                            <SelectItem value="856">🇱🇦 +856</SelectItem>
                            <SelectItem value="880">🇧🇩 +880</SelectItem>
                            <SelectItem value="886">🇹🇼 +886</SelectItem>
                            <SelectItem value="960">🇲🇻 +960</SelectItem>
                            <SelectItem value="961">🇱🇧 +961</SelectItem>
                            <SelectItem value="962">🇯🇴 +962</SelectItem>
                            <SelectItem value="963">🇸🇾 +963</SelectItem>
                            <SelectItem value="964">🇮🇶 +964</SelectItem>
                            <SelectItem value="965">🇰🇼 +965</SelectItem>
                            <SelectItem value="966">🇸🇦 +966</SelectItem>
                            <SelectItem value="967">🇾🇪 +967</SelectItem>
                            <SelectItem value="968">🇴🇲 +968</SelectItem>
                            <SelectItem value="970">🇵🇸 +970</SelectItem>
                            <SelectItem value="971">🇦🇪 +971</SelectItem>
                            <SelectItem value="972">🇮🇱 +972</SelectItem>
                            <SelectItem value="973">🇧🇭 +973</SelectItem>
                            <SelectItem value="974">🇶🇦 +974</SelectItem>
                            <SelectItem value="975">🇧🇹 +975</SelectItem>
                            <SelectItem value="976">🇲🇳 +976</SelectItem>
                            <SelectItem value="977">🇳🇵 +977</SelectItem>
                            <SelectItem value="992">🇹🇯 +992</SelectItem>
                            <SelectItem value="993">🇹🇲 +993</SelectItem>
                            <SelectItem value="994">🇦🇿 +994</SelectItem>
                            <SelectItem value="995">🇬🇪 +995</SelectItem>
                            <SelectItem value="996">🇰🇬 +996</SelectItem>
                            <SelectItem value="998">🇺🇿 +998</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p
                          id="country-code-error"
                          className="mt-2 text-sm text-red-600"
                          role="alert"
                          aria-live="polite"
                        >
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="basis-3/4">
                <label
                  htmlFor="number"
                  className="text-primary-1008 font-normal mb-2 block"
                >
                  Phone Number
                </label>
                <input
                  id="number"
                  type="tel"
                  placeholder="Phone Number"
                  className="border w-full border-primary-1007 h-11 px-5"
                  icon={<Phone className="w-5 h-5" />}
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
                value={watch('gender') || String(window.user?.gender?.id || '1')}
                onValueChange={(val) => {
                  setValue('gender', val);
                }}
              >
                <SelectTrigger className="w-full h-11! rounded-none border-primary-1007">
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
