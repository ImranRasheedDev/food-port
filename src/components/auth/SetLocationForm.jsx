import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAddAddress, useUpdateAddress } from "@/hooks/api";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { toast } from "react-toastify";

const SetLocationForm = ({ address = null }) => {
    const navigate = useNavigate();
    const isEditing = !!address;
    const [currentAddress, setCurrentAddress] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            label: "",
            address: "",
            latitude: "",
            longitude: "",
            city: "",
            zip_code: "",
            house_no: "",
        },
    });

    // Watch the address field for map display
    const watchedAddress = watch("address");
    const watchedLatitude = watch("latitude");
    const watchedLongitude = watch("longitude");

    // Set current address for map display
    useEffect(() => {
        if (watchedAddress && watchedLatitude && watchedLongitude) {
            setCurrentAddress({
                address: watchedAddress,
                latitude: watchedLatitude,
                longitude: watchedLongitude,
            });
        }
    }, [watchedAddress, watchedLatitude, watchedLongitude]);

    // Populate form when address changes (edit mode)
    useEffect(() => {
        if (address) {
            // Handle both flat and nested location structures from API
            const latitude = address.latitude || address.location?.latitude || "";
            const longitude = address.longitude || address.location?.longitude || "";

            setValue("label", address.name || address.label || "");
            setValue("address", address.address || "");
            setValue("latitude", latitude);
            setValue("longitude", longitude);
            setValue("city", address.city || "");
            setValue("zip_code", address.zip_code || "");
            setValue("house_no", address.house_no || "");

            // Set current address for map
            if (address.address) {
                setCurrentAddress({
                    address: address.address,
                    latitude: latitude,
                    longitude: longitude,
                });
            }
        }
    }, [address, setValue]);

    const updateAddress = useUpdateAddress({
        onSuccess: async (data) => {
            console.log("=== SetLocationForm: Address updated successfully ===");
            console.log("SetLocationForm: Updated address data:", data);

            // If the edited address was the default address, update window.user
            if (address && address.default === true && window.user) {
                console.log("SetLocationForm: Updated address was default, updating window.user");

                const formData = watch();
                window.user.address = formData.address;
                window.user.user_address = formData.address;
                window.user.latitude = formData.latitude || window.user.latitude;
                window.user.longitude = formData.longitude || window.user.longitude;
                window.user.city = formData.city || window.user.city;
                window.user.zip_code = formData.zip_code || window.user.zip_code;

                console.log("SetLocationForm: Updated window.user:", window.user);

                // Save to storage to persist after reload
                await window.helper.setStorageData("user", window.user);
                console.log("SetLocationForm: User data saved to storage");

                // Dispatch event to notify other components
                console.log("SetLocationForm: Dispatching userUpdated event");
                window.dispatchEvent(new CustomEvent('userUpdated', {
                    detail: { ...window.user }
                }));
                console.log("SetLocationForm: userUpdated event dispatched");
            }
            toast.success("Address updated successfully");
            navigate("/account-settings");
        },
    });

    const addAddress = useAddAddress({
        onSuccess: async (data) => {
            console.log("=== SetLocationForm: Address added successfully ===");
            console.log("SetLocationForm: New address data:", data);

            // If the new address is the default (first address), update window.user
            if (data?.data?.default === true && window.user) {
                console.log("SetLocationForm: New address is default, updating window.user");

                window.user.address = data.data.address;
                window.user.user_address = data.data.address;
                window.user.latitude = data.data.latitude || window.user.latitude;
                window.user.longitude = data.data.longitude || window.user.longitude;
                window.user.city = data.data.city || window.user.city;
                window.user.zip_code = data.data.zip_code || window.user.zip_code;

                console.log("SetLocationForm: Updated window.user:", window.user);

                // Save to storage to persist after reload
                await window.helper.setStorageData("user", window.user);
                console.log("SetLocationForm: User data saved to storage");

                // Dispatch event to notify other components
                console.log("SetLocationForm: Dispatching userUpdated event");
                window.dispatchEvent(new CustomEvent('userUpdated', {
                    detail: { ...window.user }
                }));
                console.log("SetLocationForm: userUpdated event dispatched");
            }

            toast.success("Address added successfully");
            reset();
            navigate("/account-settings");
        },
    });

    const onSubmit = (data) => {
        if (isEditing) {
            // Update existing address
            const payload = {
                address_id: address.id,
                name: data.label || "Home",
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            };
            updateAddress.mutate(payload);
        } else {
            // Add new address
            const payload = {
                name: data.label || "Home",
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                house_no: data.house_no || "",
            };
            addAddress.mutate(payload);
        }
    };



    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">
                {isEditing ? "Edit Your Location" : "Set Your Location"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Map Display */}
                <div className="relative">
                    {currentAddress ? (
                        <div className="relative">
                            <div style={{ width: '100%', overflow: 'hidden', height: '300px' }}>
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(currentAddress.address)}&output=embed`}
                                    width="100%"
                                    height="600"
                                    style={{ border: 0, borderRadius: '8px', marginTop: '-150px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Location Map"
                                />
                            </div>

                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                📍 Your Address
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg h-[300px]">
                            <div className="text-center text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Select an address to see it on the map</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8 w-full lg:w-1/2 mt-10">
                    {/* Address */}
                    <div>
                        <label
                            htmlFor="yourAddress"
                            className="text-primary-1008 font-normal mb-2 block"
                        >
                            Your Address
                        </label>
                        <AddressAutocomplete
                            id="yourAddress"
                            placeholder="Search address"
                            setValue={setValue}
                            icon={<MapPin className="w-5 h-5" />}
                            error={errors.address?.message}
                            defaultValue={address?.address || ""}
                        />
                        <input type="hidden" {...register("address", { required: "Address is required" })} />
                        <input type="hidden" {...register("latitude", { required: "Please select a valid address" })} />
                        <input type="hidden" {...register("longitude", { required: "Please select a valid address" })} />
                        <input type="hidden" {...register("city")} />
                        <input type="hidden" {...register("zip_code")} />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                        {errors.latitude && (
                            <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
                        )}
                    </div>

                    {/* Label Selection */}
                    <div>
                        <label
                            htmlFor="labelInput"
                            className="text-primary-1008 font-normal mb-2 block"
                        >
                            Add a Label <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="labelInput"
                            placeholder="e.g., Home, Work, Office"
                            className="border w-full border-primary-1007 h-14 px-5 rounded-full focus:outline-none bg-white focus:ring-2 focus:ring-primary-50"
                            {...register("label")}
                        />
                    </div>

                    {/* House Number - Only for Add New Address */}
                    {!isEditing && (
                        <div>
                            <label
                                htmlFor="houseNoInput"
                                className="text-primary-1008 font-normal mb-2 block"
                            >
                                House/Apt Number <span className="text-gray-400 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="houseNoInput"
                                placeholder="e.g., Apt 4B, Suite 100, House 25"
                                className="border w-full border-primary-1007 h-14 px-5 rounded-full focus:outline-none bg-white focus:ring-2 focus:ring-primary-50"
                                {...register("house_no")}
                            />
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={updateAddress.isPending || addAddress.isPending}
                            className="bg-primary-50 text-white rounded-full flex-1 max-w-md py-3 inline-block cursor-pointer hover:bg-primary-50/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditing
                                ? (updateAddress.isPending ? "Updating..." : "Update Address")
                                : (addAddress.isPending ? "Adding..." : "Add Address")
                            }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SetLocationForm;
