import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

export default function PersonalDetail({ addresses = [] }) {
    const defaultEmail = window?.user?.email || "";
    const defaultName = window?.user?.name || window?.user?.full_name || "";
    const defaultPhone = window?.user?.phone || window?.user?.mobile || "";

    // Check if user is logged in
    const isLoggedIn = !window.lodash.isEmpty(window.user);

    // Find default address from addresses array
    const defaultAddress = addresses.find(addr => addr.default) || addresses[0];

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: defaultEmail,
            fullName: defaultName,
            mobileNumber: defaultPhone,
        }
    });

    useEffect(() => {
        if (defaultEmail) setValue("email", defaultEmail);
        if (defaultName) setValue("fullName", defaultName);
        if (defaultPhone) setValue("mobileNumber", defaultPhone);
    }, [defaultEmail, defaultName, defaultPhone, setValue]);

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return "No address selected";
        const parts = [address.street, address.city, address.state, address.zip_code].filter(Boolean);
        return parts.join(", ");
    };

    return (
        <div className="border border-primary-1007 rounded-lg p-4">
            <h1 className="font-bold text-2xl mb-6">Personal details</h1>

            {/* Address Section for logged-in users */}
            {isLoggedIn && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">Delivery Address</h3>
                       <Link to="/account-settings">
                        <span on className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                            Change from profile
                        </span>
                        </Link>
                    </div>
                    <div className="text-gray-700">
                        {defaultAddress ? (
                            <div>
                                <p className="font-medium">{defaultAddress.address || "Default Address"}</p>
                                <p className="text-sm text-gray-600">{formatAddress(defaultAddress)}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No default address set</p>
                        )}
                    </div>
                </div>
            )}

            {/* <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input
                        type="email"
                        placeholder="Enter Your Email"
                        id="email"
                        className={`w-full border rounded-md h-14 px-8 ${errors.email ? 'border-red-500' : 'border-primary-1007'}`}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        className={`w-full border rounded-md h-14 px-8 ${errors.fullName ? 'border-red-500' : 'border-primary-1007'}`}
                        {...register("fullName", {
                            required: "Full name is required",
                            minLength: {
                                value: 2,
                                message: "Full name must be at least 2 characters"
                            }
                        })}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Mobile Number"
                        id="mobileNumber"
                        className={`w-full border rounded-md h-14 px-8 ${errors.mobileNumber ? 'border-red-500' : 'border-primary-1007'}`}
                        {...register("mobileNumber", {
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Please enter a valid mobile number (10-15 digits)"
                            }
                        })}
                    />
                    {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                    )}
                </div>
                <div>
                    <button type="submit" className="bg-primary-50 rounded-full h-14 w-full text-white cursor-pointer">Save</button>
                </div>
            </form> */}
        </div>
    )
}