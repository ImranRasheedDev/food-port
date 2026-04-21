import React from "react";
import { useForm } from "react-hook-form";
import { MapPin } from "lucide-react";
import { useAddAddress } from "@/hooks/api";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SimpleAddressAddModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
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
      name: "",
    },
  });

  const addAddress = useAddAddress({
    onSuccess: (data) => {
      onSuccess?.(data);
      onClose();
      reset();
    },
  });

  const onSubmit = (data) => {
    const payload = {
      label: data.label || "Home", // Use provided name or auto-generate
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      zip_code: data.zip_code,
      name: data.city || data.address,
    };
    addAddress.mutate(payload);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Address</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Add a Label <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-50"
              placeholder="e.g., Home, Work, Office"
              {...register("label")}
            />
          </div>

          {/* Address with Google Places Autocomplete */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Search Address
            </label>
            <AddressAutocomplete
              id="address"
              placeholder="Type your address..."
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
              disabled={addAddress.isPending}
              className="flex-1 bg-primary-50 hover:bg-primary-50/90"
            >
              {addAddress.isPending ? "Adding..." : "Add Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleAddressAddModal;
