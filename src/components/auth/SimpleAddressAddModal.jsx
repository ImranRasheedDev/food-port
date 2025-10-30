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
      address: "",
      latitude: "",
      longitude: "",
      city: "",
      zip_code: "",
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
