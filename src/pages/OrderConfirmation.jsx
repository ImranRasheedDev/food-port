import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "@/contexts/CartContext";
import {
  useAllAddresses,
  usePlaceOrder,
  formatCartForAPI,
  useRestaurantDetail,
} from "@/hooks/api";
import DynamicRestaurantAddress from "@/components/InnerPages/DynamicRestaurantAddress";
import PersonalDetail from "@/components/InnerPages/PersonalDetail";
import PaymentMethodSelect from "@/components/InnerPages/PaymentMethodSelect";
import DynamicFoodOrderedFrom from "@/components/InnerPages/DynamicFoodOrderedFrom";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getCartTotal, clearCart, isCartEmpty } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [platformFee, setPlatformFee] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Get restaurant ID from cart items or location state
  const restaurantId = items[0]?.restaurantId || location.state?.restaurantId;

  const { data: addresses } = useAllAddresses();
  const { data: restaurantData } = useRestaurantDetail(restaurantId, {
    enabled: !!restaurantId,
  });
  const placeOrderMutation = usePlaceOrder({
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-waiting", { state: { orderData: data } });
    },
    onError: (error) => {
      toast.error("Failed to place order. Please try again.");
      setIsPlacingOrder(false);
    },
  });

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = !window.lodash.isEmpty(window.user);
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    if (isCartEmpty()) {
      navigate("/");
      return;
    }
  }, [navigate, isCartEmpty]);

  // Set default address
  useEffect(() => {
    if (addresses?.data && !selectedAddress) {
      const defaultAddress =
        addresses.data.find((addr) => addr.default) || addresses.data[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  // Handle payment intent and platform fee from AddCard page
  useEffect(() => {
    if (location.state?.paymentIntentId) {
      setPaymentIntentId(location.state.paymentIntentId);
      setPlatformFee(location.state.platformFee);
      // Clear the state to avoid re-processing
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    // If card payment selected but no payment intent, redirect to add card
    if (paymentMethod === "card" && !paymentIntentId) {
      navigate("/add-card", {
        state: {
          returnTo: "/order-confirmation",
          totalPrice: getCartTotal(),
          restaurantId: restaurantId,
        },
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Get restaurant ID from first cart item
      const restaurantId = items[0]?.restaurantId;

      // Format cart data for API with payment intent and platform fee from Stripe
      const orderData = formatCartForAPI(
        items,
        restaurantId,
        selectedAddress.id,
        addresses?.data,
        paymentIntentId,
        getCartTotal(),
        platformFee
      );

      // Place order
      placeOrderMutation.mutate(orderData);
    } catch (error) {
      toast.error("Failed to place order");
      setIsPlacingOrder(false);
    }
  };

  // Show loading if cart is empty or user not logged in
  if (isCartEmpty() || window.lodash.isEmpty(window.user)) {
    return <div className="h-[150px]" />;
  }

  return (
    <>
      <div className="h-[150px]" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
          <div className="lg:col-span-2 col-span-1 space-y-10">
            <DynamicRestaurantAddress
              restaurantData={restaurantData?.data}
              selectedAddress={selectedAddress}
              onAddressChange={setSelectedAddress}
            />
            <PersonalDetail
              addresses={addresses?.data || []}
              selectedAddress={selectedAddress}
              onAddressChange={setSelectedAddress}
            />
            <PaymentMethodSelect
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>
          <div className="lg:col-span-1 col-span-1">
            <DynamicFoodOrderedFrom
              cartItems={items}
              totalPrice={getCartTotal()}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          </div>
        </div>
      </div>
    </>
  );
}
