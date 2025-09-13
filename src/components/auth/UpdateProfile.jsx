import React from "react";
import { useForm } from "react-hook-form";

const UpdateProfile = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Kevin.gilbert@gmail.com",
            phoneNumber: "+1-202-555-0118",
            countryRegion: "USA",
            states: "New York",
            zipCode: "1207",
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-8">Account Setting</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-x-8">
                    <div>
                        <img
                            src="/images/all.jpg"
                            alt=""
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                        {/* First Name */}
                        <div>
                            <label
                                htmlFor="firstName"
                                className="text-primary-1008 font-normal mb-2 block"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className="border w-full border-primary-1007 h-11 px-5"
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label
                                htmlFor="lastName"
                                className="text-primary-1008 font-normal mb-2 block"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                className="border w-full border-primary-1007 h-11 px-5"
                                {...register("lastName", { required: "Last name is required" })}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
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

                        {/* Phone Number */}
                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="text-primary-1008 font-normal mb-2 block"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                className="border w-full border-primary-1007 h-11 px-5"
                                {...register("phoneNumber", {
                                    required: "Phone number is required",
                                })}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm">
                                    {errors.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Country/Region */}
                        <div>
                            <label
                                htmlFor="countryRegion"
                                className="text-primary-1008 font-normal mb-2 block"
                            >
                                Country/Region
                            </label>
                            <input
                                type="text"
                                id="countryRegion"
                                className="border w-full border-primary-1007 h-11 px-5"
                                {...register("countryRegion", {
                                    required: "Country/Region is required",
                                })}
                            />
                            {errors.countryRegion && (
                                <p className="text-red-500 text-sm">
                                    {errors.countryRegion.message}
                                </p>
                            )}
                        </div>

                        {/* States + Zip Code */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="states"
                                    className="text-primary-1008 font-normal mb-2 block"
                                >
                                    States
                                </label>
                                <input
                                    type="text"
                                    id="states"
                                    className="border w-full border-primary-1007 h-11 px-5"
                                    {...register("states", { required: "State is required" })}
                                />
                                {errors.states && (
                                    <p className="text-red-500 text-sm">{errors.states.message}</p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="zipCode"
                                    className="text-primary-1008 font-normal mb-2 block"
                                >
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    className="border w-full border-primary-1007 h-11 px-5"
                                    {...register("zipCode", { required: "Zip Code is required" })}
                                />
                                {errors.zipCode && (
                                    <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Button */}
                        <div>
                            <button
                                type="submit"
                                className="bg-primary-50 text-white rounded-full px-12 py-3 inline-block w-auto cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;
