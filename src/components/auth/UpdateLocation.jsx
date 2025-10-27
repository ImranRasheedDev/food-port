import { Home, MapPin, Edit, Trash2, Star, Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAllAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/api";
import AddressEditModal from "./AddressEditModal";
import SimpleAddressAddModal from "./SimpleAddressAddModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2 as TrashIcon, AlertTriangle } from "lucide-react";
import { processImageUrl } from "@/lib/utils";

const UpdateLocation = () => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    addressId: null,
    addressName: "",
  });
  const [loadingStates, setLoadingStates] = useState({
    deleting: {},
    settingDefault: {},
    updating: {},
  });

  const { data: addresses, isLoading, error,refetch } = useAllAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (address) => {
    setDeleteConfirmModal({
      isOpen: true,
      addressId: address.id,
      addressName: address.name || address.address,
    });
  };

  const handleDeleteConfirm = () => {
    const { addressId } = deleteConfirmModal;

    // Set loading state for specific address
    setLoadingStates((prev) => ({
      ...prev,
      deleting: { ...prev.deleting, [addressId]: true },
    }));

    deleteAddress.mutate(addressId, {
      onSuccess: (data) => {
        console.log("Address deleted successfully:", data);
        setDeleteConfirmModal({
          isOpen: false,
          addressId: null,
          addressName: "",
        });
        refetch
        // Clear loading state
        setLoadingStates((prev) => ({
          ...prev,
          deleting: { ...prev.deleting, [addressId]: false },
        }));
        refetch()
        // Addresses will be automatically refetched due to query invalidation
      },
      onError: (error) => {
        console.error("Error deleting address:", error);
        // Clear loading state on error
        setLoadingStates((prev) => ({
          ...prev,
          deleting: { ...prev.deleting, [addressId]: false },
        }));
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmModal({ isOpen: false, addressId: null, addressName: "" });
  };

  const handleSetDefault = (addressId) => {
    // Set loading state for specific address
    setLoadingStates((prev) => ({
      ...prev,
      settingDefault: { ...prev.settingDefault, [addressId]: true },
    }));

    setDefaultAddress.mutate(
      { address_id: addressId },
      {
        onSuccess: (data) => {
          console.log("Default address set successfully:", data);
          // Clear loading state
          setLoadingStates((prev) => ({
            ...prev,
            settingDefault: { ...prev.settingDefault, [addressId]: false },
          }));
          refetch()
          // Addresses will be automatically refetched due to query invalidation
        },
        onError: (error) => {
          console.error("Error setting default address:", error);
          // Clear loading state on error
          setLoadingStates((prev) => ({
            ...prev,
            settingDefault: { ...prev.settingDefault, [addressId]: false },
          }));
        },
      }
    );
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingAddress(null);
    // Addresses will be automatically refetched due to query invalidation
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    // Addresses will be automatically refetched due to query invalidation
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading addresses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading addresses. Please try again.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Your Addresses</h2>

      {/* Map Display */}
      <div>
        <img
          src={processImageUrl("/images/map.jpg")}
          alt=""
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>

      {/* Current Address Display */}
      {addresses?.data?.find((addr) => addr.default === true) && (
        <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-50" />
            <div>
              <p className="font-medium">Current Address:</p>
              <p className="text-gray-600">
                {addresses.data.find((addr) => addr.default === true)?.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500">Default</span>
          </div>
        </div>
      )}

      {/* Add New Address Button */}
      <div className="my-6">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full bg-primary-50 hover:bg-primary-50/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Saved Addresses */}
      <div className="my-4">
        <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

        {addresses?.data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No addresses saved yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses?.data?.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      {/* <span className="font-medium">
                        {address.name || "Address"}
                      </span> */}
                      {address.default === true && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      {address.address}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {address.city && address.zip_code ? `${address.city}, ${address.zip_code}` : 
                       address.city ? address.city : 
                       address.zip_code ? address.zip_code : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                                        {address.default !== true && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={loadingStates.settingDefault[address.id]}
                        className="text-xs"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {loadingStates.settingDefault[address.id]
                          ? "Setting..."
                          : "Set Default"}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>

                    {address.default !== true && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(address)}
                        disabled={loadingStates.deleting[address.id]}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {loadingStates.deleting[address.id]
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Address Modal - Simple Mode */}
      <AddressEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSuccess={handleEditSuccess}
        isSimpleEdit={true}
      />

      {/* Add Address Modal - Simple Mode */}
      <SimpleAddressAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmModal.isOpen}
        onOpenChange={handleDeleteCancel}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Delete Address
              </DialogTitle>
            </div>
          </DialogHeader>

          <DialogDescription className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>"{deleteConfirmModal.addressName}"</strong>? This action
            cannot be undone.
          </DialogDescription>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={loadingStates.deleting[deleteConfirmModal.addressId]}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loadingStates.deleting[deleteConfirmModal.addressId]}
              className="bg-red-600 hover:bg-red-700"
            >
              {loadingStates.deleting[deleteConfirmModal.addressId] ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Address
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateLocation;
