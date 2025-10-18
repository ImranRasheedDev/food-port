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
import LayoutWrapper from "@/components/layoutWrapper";
export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getCartTotal, clearCart, isCartEmpty } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [platformFee, setPlatformFee] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isGeneratingIntent, setIsGeneratingIntent] = useState(false);

  // Get restaurant ID from cart items or location state
  const restaurantId = items[0]?.restaurantId || location.state?.restaurantId;

  const { data: addresses } = useAllAddresses();
  const { data: restaurantData } = useRestaurantDetail(restaurantId, {
    enabled: !!restaurantId,
  });
  const placeOrderMutation = usePlaceOrder({
    onSuccess: (data) => {
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
      const defaultAddress = addresses.data.find((addr) => addr.default) || addresses.data[0];
      if (defaultAddress) setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  // Handle payment intent and platform fee from AddCard page (no auto place here)
  useEffect(() => {
    if (location.state?.paymentIntentId) {
      setPaymentIntentId(location.state.paymentIntentId);
      setPlatformFee(location.state.platformFee);
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Create Stripe PaymentIntent using Stripe REST API (requires VITE_STRIPE_SECRET_KEY)
  const createStripePaymentIntent = async (amountCents) => {
    const secret = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!secret) throw new Error("Missing VITE_STRIPE_SECRET_KEY");
    const params = new URLSearchParams();
    params.append('amount', String(amountCents));
    params.append('currency', 'usd');
    params.append('automatic_payment_methods[enabled]', 'true');
    if (restaurantId) params.append('metadata[restaurant_id]', String(restaurantId));
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Failed to create PaymentIntent');
    }
    const json = await res.json();
    return { id: json.id, clientSecret: json.client_secret };
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    // If card payment selected but no payment intent, redirect to add card
    if (paymentMethod === "card" && !paymentIntentId) {
      const subtotal = getCartTotal();
      const deliveryFee = restaurantData?.data?.delivery_fee ? parseFloat(restaurantData.data.delivery_fee) : 0;
      const platformFeePercentage = restaurantData?.data?.platform_fee_percent ? parseFloat(restaurantData.data.platform_fee_percent) : 0;
      const vatPercentage = restaurantData?.data?.tax ? parseFloat(restaurantData.data.tax) : 0;

      const platformFeeAmount = parseFloat((subtotal * (platformFeePercentage / 100)).toFixed(2));
      const vatAmount = parseFloat((subtotal * (vatPercentage / 100)).toFixed(2));
      const finalTotal = parseFloat((parseFloat(subtotal) + vatAmount + platformFeeAmount + deliveryFee).toFixed(2));

      try {
        setIsGeneratingIntent(true);
        const intent = await createStripePaymentIntent(Math.round(finalTotal * 100));
        navigate("/add-card", {
          state: {
            returnTo: "/order-confirmation",
            totalPrice: finalTotal,
            platformFee: platformFeeAmount,
            paymentIntentId: intent.id,
            clientSecret: intent.clientSecret,
            restaurantId: restaurantId,
            selectedAddressId: selectedAddress?.id,
          },
        });
      } catch (e) {
        toast.error("Failed to create payment intent");
      } finally {
        setIsGeneratingIntent(false);
      }
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
      <LayoutWrapper>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
          <div className="lg:col-span-2 col-span-1 space-y-10">
            <DynamicRestaurantAddress
              restaurantData={restaurantData?.data}
              selectedAddress={selectedAddress}
              onAddressChange={setSelectedAddress}
            />
            <PersonalDetail
              addresses={addresses?.data || []}
            
            />
            <PaymentMethodSelect
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder || isGeneratingIntent}
              canPlaceOrder={paymentMethod === 'card'}
              hasAddress={!!selectedAddress?.id}
            />
          </div>
          <div className="lg:col-span-1 col-span-1">
            <DynamicFoodOrderedFrom
              cartItems={items}
              totalPrice={getCartTotal()}
              restaurantData={restaurantData?.data}
            />
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
