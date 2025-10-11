import React from "react";
import { useForm, Controller } from "react-hook-form";
import { BriefcaseBusiness, Handshake, Home } from "lucide-react";
import LocationCard from "../Cards/LocationCard";

const SetLocationForm = () => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            yourAddress: "",
            yourStreetAddress: "",
            floor: "",
            hourNo: "",
            label: "Home", // default selected
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Set Your Location</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <img
                        src="/images/map.jpg"
                        alt=""
                        className="w-full h-40 object-cover"
                    />
                </div>

                <div className="space-y-8 w-1/2 mt-10">
                    {/* Address */}
                    <div>
                        <label
                            htmlFor="yourAddress"
                            className="text-primary-1008 font-normal mb-2 block"
                        >
                            Your Address
                        </label>
                        <input
                            type="text"
                            id="yourAddress"
                            className="border w-full border-primary-1007 h-11 px-5"
                            {...register("yourAddress", { required: "Address is required" })}
                        />
                        {errors.yourAddress && (
                            <p className="text-red-500 text-sm">
                                {errors.yourAddress.message}
                            </p>
                        )}
                    </div>

                    {/* Street Address */}
                    <div>
                        <label
                            htmlFor="yourStreetAddress"
                            className="text-primary-1008 font-normal mb-2 block"
                        >
                            Your Street address
                        </label>
                        <input
                            type="text"
                            id="yourStreetAddress"
                            className="border w-full border-primary-1007 h-11 px-5"
                            {...register("yourStreetAddress", {
                                required: "Street Address is required",
                            })}
                        />
                        {errors.yourStreetAddress && (
                            <p className="text-red-500 text-sm">
                                {errors.yourStreetAddress.message}
                            </p>
                        )}
                    </div>

                    {/* Floor */}
                    <div>
                        <input
                            type="text"
                            id="floor"
                            placeholder="Floor"
                            className="border w-full border-primary-1007 h-11 px-5"
                            {...register("floor")}
                        />
                    </div>

                    {/* Hour No */}
                    <div>
                        <input
                            type="text"
                            id="hourNo"
                            placeholder="House No"
                            className="border w-full border-primary-1007 h-11 px-5"
                            {...register("hourNo")}
                        />
                    </div>

                    {/* Label Selection */}
                    <div>
                        <label className="text-primary-1008 font-normal mb-6 block">
                            Add a Label
                        </label>
                        <Controller
                            control={control}
                            name="label"
                            rules={{ required: "Please select a label" }}
                            render={({ field }) => (
                                <div className="flex gap-x-6">
                                    <LocationCard field={field} value="Home" icon={<Home className="w-8 h-8" />} />
                                    <LocationCard field={field} value="Work" icon={<BriefcaseBusiness className="w-8 h-8" />} />
                                    <LocationCard field={field} value="Partner" icon={<Handshake className="w-8 h-8" />} />
                                </div>
                            )}
                        />
                        {errors.label && (
                            <p className="text-red-500 text-sm">{errors.label.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-primary-50 text-white rounded-full w-[470px] py-3 inline-block  cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SetLocationForm;
