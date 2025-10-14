import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { MapPin, X, Home, BriefcaseBusiness, Handshake } from "lucide-react";
import { useUpdateAddress, useAddAddress } from "@/hooks/api";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LocationCard from "../Cards/LocationCard";

const AddressEditModal = ({ isOpen, onClose, address, onSuccess, isSimpleAdd = false, isSimpleEdit = false }) => {
  const isEditing = !!address;
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      city: "",
      zip_code: "",
      label: "Home",
    },
  });

  const updateAddress = useUpdateAddress({
    onSuccess: (data) => {
      onSuccess?.(data);
      onClose();
      reset();
    },
  });

  const addAddress = useAddAddress({
    onSuccess: (data) => {
      onSuccess?.(data);
      onClose();
      reset();
    },
  });

  // Populate form when address changes
  useEffect(() => {
    if (address) {
      setValue("name", address.name || "");
      setValue("address", address.address || "");
      setValue("latitude", address.latitude || "");
      setValue("longitude", address.longitude || "");
      setValue("city", address.city || "");
      setValue("zip_code", address.zip_code || "");
      setValue("label", address.label || "Home");
    }
  }, [address, setValue]);

  const onSubmit = (data) => {
    if (isEditing && isSimpleEdit) {
      // Simple edit - just address, keep existing name and label
      const payload = {
        address_id: address.id,
        name: address.name || `Address ${new Date().getTime()}`, // Keep existing name
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        zip_code: data.zip_code,
        label: address.label || "Home", // Keep existing label
      };
      updateAddress.mutate(payload);
    } else if (isEditing) {
      // Full edit existing address
      const payload = {
        address_id: address.id,
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        zip_code: data.zip_code,
        label: data.label,
      };
      updateAddress.mutate(payload);
    } else if (isSimpleAdd) {
      // Simple add - just address with auto-generated name
      const payload = {
        name: `Address ${new Date().getTime()}`, // Auto-generated name
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        zip_code: data.zip_code,
        label: "Home", // Default label
      };
      addAddress.mutate(payload);
    } else {
      // Full add new address
      const payload = {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        zip_code: data.zip_code,
        label: data.label,
      };
      addAddress.mutate(payload);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing 
              ? (isSimpleEdit ? "Edit Address" : "Edit Address") 
              : isSimpleAdd 
              ? "Add Address" 
              : "Add New Address"
            }
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name - Only show for full add or edit */}
          {!isSimpleAdd && !isSimpleEdit && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Address Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-50"
                placeholder="e.g., Home, Work, Office"
                {...register("name", { required: "Address name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* Address with Google Places Autocomplete */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <AddressAutocomplete
              id="address"
              placeholder="Search address"
              setValue={setValue}
              icon={<MapPin className="w-5 h-5" />}
              error={errors.address?.message}
            />
            <input type="hidden" {...register("address", { required: "Address is required" })} />
            <input type="hidden" {...register("latitude", { required: "Please select a valid address" })} />
            <input type="hidden" {...register("longitude", { required: "Please select a valid address" })} />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
            {errors.latitude && (
              <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
            )}
          </div>

          {/* City - Only show for full add or edit */}
          {!isSimpleAdd && !isSimpleEdit && (
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-50"
                placeholder="City"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
          )}

          {/* Zip Code - Only show for full add or edit */}
          {!isSimpleAdd && !isSimpleEdit && (
            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                id="zip_code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-50"
                placeholder="Zip Code"
                {...register("zip_code", { required: "Zip code is required" })}
              />
              {errors.zip_code && (
                <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
              )}
            </div>
          )}

          {/* Label Selection - Only show for full add or edit */}
          {!isSimpleAdd && !isSimpleEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label
              </label>
              <Controller
                control={control}
                name="label"
                rules={{ required: "Please select a label" }}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <LocationCard 
                      field={field} 
                      value="Home" 
                      icon={<Home className="w-6 h-6" />} 
                    />
                    <LocationCard 
                      field={field} 
                      value="Work" 
                      icon={<BriefcaseBusiness className="w-6 h-6" />} 
                    />
                    <LocationCard 
                      field={field} 
                      value="Other" 
                      icon={<Handshake className="w-6 h-6" />} 
                    />
                  </div>
                )}
              />
              {errors.label && (
                <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateAddress.isPending || addAddress.isPending}
              className="flex-1 bg-primary-50 hover:bg-primary-50/90"
            >
              {isEditing 
                ? (updateAddress.isPending ? "Updating..." : "Update Address")
                : (addAddress.isPending ? "Adding..." : "Add Address")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressEditModal;
