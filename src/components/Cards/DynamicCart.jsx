import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import DealDiscountCard from "./DealDiscountCard";
import { Trash2, Minus, Plus } from "lucide-react";
import CardOne from "./AdsCards/CardOne";
import { processImageUrl, getStaticImagePath } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import SimpleAddressAddModal from "../auth/SimpleAddressAddModal";
import ConfirmationModal from "../ui/confirmation-modal";
import { useSetDefaultAddress } from "@/hooks/api";

export default function DynamicCart({
  restaurantData: propRestaurantData,
  ads = [],
}) {
  const {
    items,
    getCartTotal,
    isCartEmpty,
    removeFromCart,
    updateItemQuantity,
    restaurantData: contextRestaurantData,
    closeCartDrawer
  } = useCart();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const setDefaultAddress = useSetDefaultAddress();

  // Use prop restaurant data if available, otherwise use context data
  const restaurantData = propRestaurantData || contextRestaurantData;

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const handleAddressAddSuccess = async (newAddress = null) => {
    setIsAddAddressModalOpen(false);

    // Check if user is logged in
    if (!window.user) {
      toast.error("Please login to add address");
      navigate("/auth/login");
      return;
    }

    // If a new address was added, update window.user and set as default via API
    if (newAddress && window.user) {
      // Check if this is the first address (should be default)
      const isFirstAddress = !window.user.addresses || window.user.addresses.length === 0;

      // Update window.user with new address
      window.user.address = newAddress.address;
      window.user.latitude = newAddress.latitude || window.user.latitude;
      window.user.longitude = newAddress.longitude || window.user.longitude;
      window.user.city = newAddress.city || window.user.city;
      window.user.zip_code = newAddress.zip_code || window.user.zip_code;

      // Update addresses array in window.user
      if (!window.user.addresses) {
        window.user.addresses = [];
      }

      // Add the new address with default flag if it's the first one
      const addressToAdd = {
        ...newAddress,
        default: isFirstAddress
      };
      window.user.addresses.push(addressToAdd);

      console.log("Updated window.user with new address:", window.user);

      // Save to storage to persist after reload
      if (window.helper && window.helper.setStorageData) {
        await window.helper.setStorageData("user", window.user);
      }

      // If this is the first address, set it as default via API
      if (isFirstAddress && newAddress.id) {
        setDefaultAddress.mutate(
          { address_id: newAddress.id },
          {
            onSuccess: () => {
              console.log("Address set as default via API");

              // Update window.user with the complete address info after API success
              window.user.address = newAddress.address;
              window.user.latitude = newAddress.latitude || window.user.latitude;
              window.user.longitude = newAddress.longitude || window.user.longitude;
              window.user.city = newAddress.city || window.user.city;
              window.user.zip_code = newAddress.zip_code || window.user.zip_code;

              // Update the addresses array to mark this as default
              if (window.user.addresses && window.user.addresses.length > 0) {
                window.user.addresses[window.user.addresses.length - 1].default = true;
              }

              console.log("window.user after API success:", window.user);
              console.log("window.user.address:", window.user.address);

              // Save to storage to persist after reload
              if (window.helper && window.helper.setStorageData) {
                window.helper.setStorageData("user", window.user);
              }

              // Show success toast
              toast.success("Address added and set as default successfully!");

              // Dispatch event to notify other components (HeaderAfterLogin listens to this)
              const event = new CustomEvent('userUpdated', {
                detail: { ...window.user }
              });
              console.log("Dispatching userUpdated event with address:", event.detail.address);
              window.dispatchEvent(event);

              // Navigate to payment
              navigate("/pay");
            },
            onError: (error) => {
              console.error("Error setting address as default:", error);
              // Still show success for adding address, but warn about default
              toast.success("Address added successfully!");
              toast.warning("Address added but couldn't set as default. Please set it manually.");

              // Dispatch event to notify other components
              window.dispatchEvent(new CustomEvent('userUpdated', {
                detail: { ...window.user }
              }));

              // Navigate to payment
              navigate("/pay");
            }
          }
        );
      } else {
        // Not first address, just show success and navigate
        console.log("Not first address, window.user:", window.user);
        toast.success("Address added successfully!");

        // Dispatch event to notify other components
        const event = new CustomEvent('userUpdated', {
          detail: { ...window.user }
        });
        console.log("Dispatching userUpdated event (not first):", event.detail);
        window.dispatchEvent(event);

        // Navigate to payment
        navigate("/pay");
      }
    }
  };

  // Get processed image URL with error handling for each item
  const getImageSrc = (item) => {
    const itemKey = `${item.id}-${JSON.stringify(item.selectedAddons)}-${item.instructions || ''}`;
    if (imageErrors[itemKey] || !item.image) {
      return processImageUrl("/images/placeholder1.jpg"); // Use processImageUrl for consistent path handling
    }
    return processImageUrl(item.image, "/images/placeholder1.jpg");
  };

  if (isCartEmpty()) {
    return (
      <div className="border h-[400px] flex flex-col justify-center items-center p-4 border-primary-1007 rounded-lg">
        <div className="text-center">
          <div className="mb-4">
            <img
              src={getStaticImagePath("/images/empty-cart.png")}
              alt="Empty Cart"
              className="w-24 h-24 mx-auto opacity-50"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 text-sm">
            You haven't added anything
            to your cart!
          </p>
        </div>


      </div>
    );
  }

  const subtotal = getCartTotal();
  // Get restaurant-specific fees or use defaults
  const deliveryFee = restaurantData?.delivery_fee
    ? parseFloat(restaurantData.delivery_fee)
    : 0;
  const platformFeePercentage = 0; // Hide and exclude commission
  const vatPercentage = restaurantData?.tax
    ? parseFloat(restaurantData.tax)
    : 0;

  // Calculate fees
  const platformFee = (0).toFixed(2);
  const vatPrice = (subtotal * (vatPercentage / 100)).toFixed(2);
  const finalTotal = (
    parseFloat(subtotal) +
    parseFloat(vatPrice) +
    deliveryFee
  ).toFixed(2);



  const staticImages = ["/images/add-card-one.png", "/images/add-card-two.png", "/images/deals-14.png", "/images/add-card-two.png"]
  return (
    <div className="border  border-primary-1007 rounded-lg p-4">
      {/* Cart Items */}
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${JSON.stringify(item.selectedAddons)}-${item.instructions || ''}-${index}`}
            className="border-b border-primary-1007 pb-6 last:border-b-0"
          >
            <div className="flex gap-3 ">
              <div className="flex-shrink-0 ">
                <img
                  src={getImageSrc(item)}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={() => handleImageError(`${item.id}-${JSON.stringify(item.selectedAddons)}-${item.instructions || ''}`)}
                  loading="lazy"
                />
              </div>
              <div className="w-full ">
                <h3 className="font-bold mb-2">{item.name}</h3>

                <div className="flex justify-between  items-center mt-4 w-full">
                  <p className="font-semibold">${item.price}</p>
                  <div className="flex justify-between items-center gap-2 ">
                    <button
                      disabled={item.quantity === 1}
                      className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="w-4 h-4 text-primary-50" />
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-primary-50" />
                    </button>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-b border-t border-primary-1007 pb-2 mb-1">
        <div className="flex justify-between items-center mt-4">
          <p className="text-primary-100 font-semibold">Sub Total</p>
          <p className="text-primary-100 font-semibold">
            $ {subtotal.toFixed(2)}
          </p>
        </div>
        {/* <div className="flex justify-between items-center mt-6">
          <p className="text-primary-1013">Standard Delivery</p>
          <p className="text-primary-1013">$ {deliveryFee.toFixed(2)}</p>
        </div> */}
        {/* Commission Fee hidden by requirement */}
        <div className="flex justify-between items-center mb-6 mt-2">
          <p className="text-primary-1013">VAT ({vatPercentage}%)</p>
          <p className="text-primary-1013">$ {vatPrice}</p>
        </div>
      </div>

      {/* Ads inside cart */}
      {/* {Array.isArray(ads) && ads.length > 0 && (
        <div className="space-y-6 mb-6">
          {ads.length > 3 && (
            <CardOne
              campaignData={ads[3]}
              image={staticImages[3 % staticImages.length]}
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
              onCardClick={({ productId }) => { setSelectedProductId(productId); setOpen(true); }}
            />
          )}
          {ads.slice(4, 7).map((banner, index) => (
            <DealDiscountCard
              key={banner.id || index}
              campaignData={banner}
              cardIndex={index}
              onCardClick={({ productId }) => { setSelectedProductId(productId); setOpen(true); }}
            />
          ))}
        </div>
      )} */}

      {/* Total and Confirm */}
      <div className="pt-2 pb-3">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg">
            Total <span className="font-bold text-xs">(Incl. VAT)</span>
          </p>
          <p className="font-semibold">$ {finalTotal}</p>
        </div>
        <button
          onClick={() => {
            // Check if user is logged in first
            if (!window.user || !window.user.id) {
              toast.error("Please login to place order");
              navigate("/auth/login");
              return;
            }

            // Check if user has any address (from addresses array or direct address field)
            const hasAddress = !!(window.user && (
              (Array.isArray(window.user.addresses) && window.user.addresses.length > 0) ||
              window.user.address
            ));

            if (!hasAddress) {
              setIsAddressModalOpen(true);
              return;
            }
            closeCartDrawer();
            navigate("/pay");
          }}
          className="bg-primary-50 text-white block w-full py-3 cursor-pointer rounded-full text-sm"
        >
          Confirm order
        </button>
      </div>

      {/* Address Modal */}
      <ConfirmationModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        title="Add delivery address"
        description="You need a delivery address to complete your order. Would you like to add one now?"
        confirmText="Add Address"
        cancelText="Cancel"
        onConfirm={() => {
          // Check if user is logged in before opening address modal
          if (!window.user) {
            toast.error("Please login to add address");
            navigate("/auth/login");
            setIsAddressModalOpen(false);
            return;
          }
          setIsAddressModalOpen(false);
          setIsAddAddressModalOpen(true);
        }}
        onCancel={() => setIsAddressModalOpen(false)}
      />

      {/* Add Address Modal */}
      <SimpleAddressAddModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        onSuccess={handleAddressAddSuccess}
      />
    </div>
  );
}