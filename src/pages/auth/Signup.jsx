import { AuthButton } from "@/components/auth/AuthButton";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputWithIcon } from "@/components/auth/InputWithIcon";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Calendar, Mail, Phone, User, MapPin } from "lucide-react";
import { useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUser, useAddAddress } from "@/hooks/api";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { getFcmToken } from "@/lib/generateFcmToken";
import { usePageLoader } from "@/hooks/usePageLoader";

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
  address: /^[A-Za-z\s\-']+$/,
  // city: /^[A-Za-z\s\-']+$/,
  // zip_code: /^[0-9]{5}$/,
};

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      number: "",
      country_code: "",
      dob: "",
      gender: "",
      address: "",
      // city: "",
      // zip_code: "",
      latitude: "",
      longitude: "",
    },
  });
  const navigate = useNavigate();
  const password = watch("password");
  const isSubmittingRef = useRef(false);

  const addAddress = useAddAddress({
    onSuccess: () => { },
  });

  // Initialize the register user mutation
  const registerUser = useRegisterUser({
    onSuccess: async (data) => {
      // Show success toast for registration only
      // Capture form values BEFORE reset
      const formValues = getValues();
      console.log("formValues before reset", formValues);

      // Create user data with form values included
      const userWithAddress = {
        ...data?.data,
        name: `${formValues.first_name} ${formValues.last_name}`, // Ensure name is set
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        address: formValues.address || "",
        latitude: formValues.latitude || "",
        longitude: formValues.longitude || "",
        // city: formValues.city || "",
        // zip_code: formValues.zip_code || "", 
      };

      // Save to storage and global user store
      await window.helper.setStorageData("user", userWithAddress);
      window.user = userWithAddress;

      // Reset form after saving values
      reset();

      try {
        const addressPayload = {
          name: formValues.first_name && formValues.last_name
            ? `${formValues.first_name} ${formValues.last_name}`
            : data?.data?.name || "",
          address: formValues.address || "",
          latitude: formValues.latitude || "",
          longitude: formValues.longitude || "",
        };

        // Only add address if address data is available
        if (addressPayload.address && addressPayload.address.trim() !== "" &&
          addressPayload.latitude && addressPayload.longitude) {
          addAddress.mutate(addressPayload, {
            onSuccess: (addressData) => {

              // Merge address data with existing user data in global store
              const updatedUser = {
                ...window.user,
                name: `${formValues.first_name} ${formValues.last_name}`, // Ensure name is set
                address: formValues.address || "",
                latitude: formValues.latitude || "",
                longitude: formValues.longitude || "",
                // city: formValues.city || "",
                // zip_code: formValues.zip_code || "",
                address_data: addressData?.data || null // Store the full address response
              };

              // Update global user store with address data
              window.helper.setStorageData("user", updatedUser);
              window.user = updatedUser;

              isSubmittingRef.current = false;
              navigate("/");
            },
            onError: () => {
              isSubmittingRef.current = false;
              navigate("/"); // Still navigate even if address fails
            }
          });
        } else {
          // No address to add, but still save form address data to user store
          const updatedUser = {
            ...window.user,
            name: `${formValues.first_name} ${formValues.last_name}`, // Ensure name is set
            address: formValues.address || "",
            latitude: formValues.latitude || "",
            longitude: formValues.longitude || "",
            // city: formValues.city || "",
            // zip_code: formValues.zip_code || ""
          };

          // Update global user store with form address data
          window.helper.setStorageData("user", updatedUser);
          window.user = updatedUser;

          isSubmittingRef.current = false;
          navigate("/");
        }
      } catch (err) {
        console.error("Error preparing address payload:", err);
        isSubmittingRef.current = false;
        navigate("/");
      }
    },
    onError: (error) => {
      isSubmittingRef.current = false;
    },
  });

  // Show loader when signing up
  usePageLoader(registerUser.isPending || addAddress.isPending, 'Creating your account...');

  const onSubmit = useCallback(
    async (data) => {
      const fcmToken = await getFcmToken();
      if (registerUser.isPending || addAddress.isPending || isSubmittingRef.current) {
        return;
      }
      isSubmittingRef.current = true;

      const userPayload = {
        name: `${data.first_name} ${data.last_name}`, // Concatenate first and last name
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        number: data.number,
        country_code: data.country_code,
        dob: data.dob,
        gender: data.gender === 'male' ? 1 : 2, // Convert to number: male=1, female=2
        address: data.address,
        //  city: data.city,
        // zip_code: data.zip_code,
        fcm_token: fcmToken || "NO_TOKEN_GENERATED",
      };

      // Call register API first
      registerUser.mutate(userPayload);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* First Name and Last Name */}
        <div className="flex gap-2">
          <div className="basis-1/2">
            <InputWithIcon
              id="first_name"
              type="text"
              placeholder="First Name"
              icon={<User className="w-5 h-5" />}
              {...register("first_name", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "First name must be less than 50 characters",
                },
                pattern: {
                  value: VALIDATION_PATTERNS.name,
                  message:
                    "Please enter a valid first name (letters, spaces, hyphens, and apostrophes only)",
                },
              })}
              error={errors.first_name?.message}
            />
          </div>
          <div className="basis-1/2">
            <InputWithIcon
              id="last_name"
              type="text"
              placeholder="Last Name"
              icon={<User className="w-5 h-5" />}
              {...register("last_name", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Last name must be less than 50 characters",
                },
                pattern: {
                  value: VALIDATION_PATTERNS.name,
                  message:
                    "Please enter a valid last name (letters, spaces, hyphens, and apostrophes only)",
                },
              })}
              error={errors.last_name?.message}
            />
          </div>
        </div>
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
                      className={`w-full h-14! rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 pl-6 pr-6 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : ''
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

        <AddressAutocomplete
          id="address"
          placeholder="Search address"
          setValue={setValue}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="26"
              fill="none"
              viewBox="0 0 28 26"
            >
              <path
                fill="#8A8A8A"
                d="m27.719 6.016-3.325-2.643a2.8 2.8 0 0 0-.73-.343 2.8 2.8 0 0 0-.794-.141H13.3l1.121 7.222h8.45c.229 0 .516-.053.792-.141.276-.089.542-.21.73-.341l3.324-2.647c.19-.131.283-.306.283-.482s-.094-.351-.281-.484M11.9 0h-1.4a.7.7 0 0 0-.495.212.73.73 0 0 0-.205.51v5.056H5.13c-.233 0-.518.053-.794.143a2.7 2.7 0 0 0-.73.34L.281 8.906C.092 9.036 0 9.213 0 9.389c0 .175.092.35.281.484l3.325 2.646c.188.131.453.253.73.34s.561.141.794.141H9.8v12.278c0 .191.074.375.205.51A.7.7 0 0 0 10.5 26h1.4a.7.7 0 0 0 .495-.212.73.73 0 0 0 .205-.51V.722a.73.73 0 0 0-.205-.51A.7.7 0 0 0 11.9 0"
              ></path>
            </svg>
          }
          error={errors.address?.message}
        />
        <input type="hidden" {...register("address", { required: "Address is required" })} />
        <input type="hidden" {...register("latitude", { required: "Latitude missing. Please select a suggestion" })} />
        <input type="hidden" {...register("longitude", { required: "Longitude missing. Please select a suggestion" })} />
        {/* <InputWithIcon
          id="address"
          type="text"
          placeholder="Address"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="26"
              fill="none"
              viewBox="0 0 28 26"
            >
              <path
                fill="#8A8A8A"
                d="m27.719 6.016-3.325-2.643a2.8 2.8 0 0 0-.73-.343 2.8 2.8 0 0 0-.794-.141H13.3l1.121 7.222h8.45c.229 0 .516-.053.792-.141.276-.089.542-.21.73-.341l3.324-2.647c.19-.131.283-.306.283-.482s-.094-.351-.281-.484M11.9 0h-1.4a.7.7 0 0 0-.495.212.73.73 0 0 0-.205.51v5.056H5.13c-.233 0-.518.053-.794.143a2.7 2.7 0 0 0-.73.34L.281 8.906C.092 9.036 0 9.213 0 9.389c0 .175.092.35.281.484l3.325 2.646c.188.131.453.253.73.34s.561.141.794.141H9.8v12.278c0 .191.074.375.205.51A.7.7 0 0 0 10.5 26h1.4a.7.7 0 0 0 .495-.212.73.73 0 0 0 .205-.51V.722a.73.73 0 0 0-.205-.51A.7.7 0 0 0 11.9 0"
              ></path>
            </svg>
          }
          {...register("address", {
            required: "Address is required",
            pattern: {
              value: VALIDATION_PATTERNS.address,
              message: "Please enter a valid address",
            },
          })}
          error={errors.address?.message}
        /> */}
        {/* <InputWithIcon
          id="city"
          type="text"
          placeholder="City"
          icon={<MapPin className="w-5 h-5" />}
          {...register("city", {
            required: "City is required",
            pattern: {
              value: VALIDATION_PATTERNS.address,
              message: "Please enter a valid city",
            },
          })}
          error={errors.city?.message}
        />
        <InputWithIcon
          id="zip_code"
          type="text"
          placeholder="Zip Code"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              viewBox="0 0 26 26"
            >
              <path
                stroke="#8A8A8A"
                strokeLinecap="square"
                strokeWidth="1.8"
                d="M13 1.8v22.4m11.2-11.208H1.8m20.8 0A9.61 9.61 0 0 1 13 22.6c-5.3 0-9.6-4.31-9.6-9.608a9.598 9.598 0 0 1 16.386-6.784 9.6 9.6 0 0 1 2.814 6.784Z"
              ></path>
            </svg>
          }
          {...register("zip_code")}
          error={errors.zip_code?.message}
        /> */}
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
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Gender is required" }}
          render={({ field, fieldState }) => (
            <div className="w-full ">
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Trigger validation after selection
                  setTimeout(() => {
                    if (!value) {
                      field.onBlur();
                    }
                  }, 0);
                }}
              >
                <SelectTrigger
                  className={`w-full h-14! rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 pl-6 pr-6 ${fieldState.error ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                  aria-invalid={fieldState.error ? "true" : "false"}
                  aria-describedby={fieldState.error ? "gender-error" : undefined}
                >
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
              {fieldState.error && (
                <p
                  id="gender-error"
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
        {/* Create Account Button */}
        <div className="pt-6">
          <AuthButton
            type="submit"
            loading={registerUser.isPending || addAddress.isPending || isSubmittingRef.current}
            disabled={registerUser.isPending || addAddress.isPending || isSubmittingRef.current}
          >
            {registerUser.isPending || addAddress.isPending
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
