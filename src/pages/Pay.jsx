import { useEffect, useMemo, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { formatCartForAPI, usePlaceOrder, useAllAddresses, useRestaurantDetail } from "@/hooks/api";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { 
  CreditCard, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle, 
  ShoppingBag,
  ArrowLeft,
  User,
  Mail,
  Lock
} from "lucide-react";

// Lazily load Stripe with provided publishable key, fallback to test key for dev
const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const fallbackPk = "pk_test_51HhEh1HhiY9nz3fzIlFK9sACJlbOdMd1VONAyHttLqMYb5guZ273Y91dFVRCzrwELaQ8A0H9VDqATXR3LK53jF3e00wbKCKtze";
const stripePromise = loadStripe(publishableKey || fallbackPk);

// Ensure amount respects Stripe currency minimums (USD: 50 cents)
function clampAmountForCurrency(amountCents, currency = "usd") {
  const currencyMin = {
    usd: 50,
    eur: 50,
    gbp: 30,
  };
  const min = currencyMin[currency.toLowerCase()] ?? 50;
  const rounded = Math.max(Math.round(amountCents), min);
  return rounded;
}

async function createStripePaymentIntent(amountCents, metadata = {}) {
  const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY ||"sk_test_51HhEh1HhiY9nz3fzIOMVCt20Ckb8peqhHDYqtRnm4WUTEk3r78foFGEcDdf0vjV6ordoui53YjtF6Mlsw9DNeWyL004vnc4y0F" ;
  if (!secretKey) throw new Error("Missing VITE_STRIPE_SECRET_KEY");
  const params = new URLSearchParams();
  const currency = "usd";
  // Pass the real amount; creation will be skipped below if below Stripe minimum
  params.append("amount", String(Math.round(amountCents)));
  params.append("currency", currency);
  // Restrict to card only so the UI shows card fields without country selector
  params.append("payment_method_types[]", "card");
  // Optional Stripe Connect fields: application_fee requires a destination (on_behalf_of)
  if (metadata.destination_account_id) {
    params.append("transfer_data[destination]", String(metadata.destination_account_id));
    if (metadata.application_fee_amount_cents != null) {
      params.append("application_fee_amount", String(metadata.application_fee_amount_cents));
    }
  }
  // Only include non-empty metadata
  Object.entries(metadata).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && !(typeof v === "number" && Number.isNaN(v))) {
      params.append(`metadata[${k}]`, String(v));
    }
  });

  console.log(params,"params",metadata);
  const res = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to create PaymentIntent");
  }
  const json = await res.json();
  return { id: json.id, clientSecret: json.client_secret };
}

function Checkout({ clientSecret, paymentIntentId, finalTotalCents, restaurantId, disabled, deliveryAddressId, userAddresses }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const placeOrderMutation = usePlaceOrder({
    onSuccess: (data) => {
      clearCart();
      navigate("/order-waiting", { state: { orderData: data } });
    },
    onError: () => toast.error("Failed to place order. Please try again."),
  });
  const [submitting, setSubmitting] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");

  // Prefill from logged-in user if available; UI is informative only
  useEffect(() => {
    const user = window.user || {};
    if (user.name && !cardholderName) setCardholderName(user.name);
    if (user.email && !email) setEmail(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    if (!stripe || !elements) return;
    if (!clientSecret) {
      toast.error("Payment initialize nahi hua. Dobara koshish karein.");
      return;
    }
    setSubmitting(true);
    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not ready");
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: cardholderName || undefined,
            email: email || undefined,
          },
        },
        return_url: window.location.origin + "/order-waiting",
      });
      if (error) throw new Error(error.message);

      // Treat requires_action/processing as submitted; webhook should confirm final status
      const confirmedPaymentIntentId = (paymentIntent && paymentIntent.id) || paymentIntentId;

      if (!confirmedPaymentIntentId) {
        toast.error("PaymentIntent create/confirm nahi hua. Payment dobara koshish karein.");
        setSubmitting(false);
        return;
      }

      // Build order payload with delivery address; exclude commission in UI
      const orderData = formatCartForAPI(
        items,
        restaurantId,
        deliveryAddressId || null,
        userAddresses || [],
        confirmedPaymentIntentId,
        finalTotalCents / 100,
        0
      );
      placeOrderMutation.mutate(orderData);
    } catch (err) {
      // If Stripe returns a PaymentIntent in the error (e.g., requires_action), capture its id
      const possibleIntentId = err?.payment_intent?.id || err?.raw?.payment_intent?.id;
      if (possibleIntentId) {
        console.warn("Stripe error with intent:", possibleIntentId);
      }
      toast.error(err?.message || "Payment failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      {(cardholderName || email) && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#D6071B]" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardholderName && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
              <input
                type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-[#D6071B] focus:border-transparent transition-all duration-200"
                value={cardholderName}
                readOnly
              />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
          )}
          {email && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
              <input
                type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-[#D6071B] focus:border-transparent transition-all duration-200"
                value={email}
                readOnly
              />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D6071B]" />
          Payment Information
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 hover:border-[#D6071B]/30 transition-colors duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Card Details</span>
            </div>
            <CardElement 
              options={{ 
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    fontFamily: 'system-ui, sans-serif',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
              }} 
            />
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting || disabled}
            className="w-full h-14 rounded-full font-medium transition-all duration-200 bg-[#D6071B] text-white hover:bg-[#B8061A] active:bg-[#A0051A] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Complete Payment - ${(finalTotalCents / 100).toFixed(2)}
              </>
            )}
      </button>
    </form>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default function Pay() {
  const { items, getCartTotal, restaurantData } = useCart();
  // Fallbacks from localStorage if context is empty (direct /pay navigation)
  const lsCart = (() => {
    try { return JSON.parse(localStorage.getItem('food-port-cart') || '[]'); } catch { return []; }
  })();
  const lsRestaurant = (() => {
    try { return JSON.parse(localStorage.getItem('food-port-restaurant') || 'null'); } catch { return null; }
  })();

  const effectiveItems = (items && items.length > 0) ? items : lsCart;
  const effectiveRestaurant = restaurantData || lsRestaurant || window.restaurant || {};
  const restaurantId = effectiveRestaurant?.id || effectiveItems[0]?.restaurantId || effectiveItems[0]?.restaurant_id;
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [error, setError] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Fetch restaurant detail to get tax/commission/destination account
  const { data: restaurantDetail } = useRestaurantDetail(restaurantId, { enabled: !!restaurantId });
  const detail = restaurantDetail?.data || {};

  // Local subtotal compute as fallback (matches CartContext)
  const computeSubtotal = (cartItems) => {
    return (cartItems || []).reduce((total, item) => {
      const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
      const selectedAddons = item.selectedAddons || {};
      const addonTotal = Object.values(selectedAddons)
        .filter((addon) => addon && addon.selected)
        .reduce((sum, addon) => sum + ((Number(addon.price) || 0) * (Number(addon.quantity) || 0) * (Number(item.quantity) || 0)), 0);
      return total + itemTotal + addonTotal;
    }, 0);
  };

  const totals = useMemo(() => {
    const subtotal = (typeof getCartTotal === 'function' && items && items.length > 0) ? getCartTotal() : computeSubtotal(effectiveItems);
    const deliveryFee = detail.delivery_fee != null ? parseFloat(detail.delivery_fee) : (effectiveRestaurant?.delivery_fee ? parseFloat(effectiveRestaurant.delivery_fee) : 0);
    const vatPercentage = detail.tax != null ? parseFloat(detail.tax) : (effectiveRestaurant?.tax ? parseFloat(effectiveRestaurant.tax) : 0);
    const vatPrice = parseFloat((subtotal * (vatPercentage / 100)).toFixed(2));
    const finalTotal = parseFloat((parseFloat(subtotal) + vatPrice + deliveryFee).toFixed(2));
    // Commission percent present but excluded from UI total by requirement
    const commissionPercent =
      detail.commission_percent != null ? parseFloat(detail.commission_percent)
      : detail.platform_fee_percent != null ? parseFloat(detail.platform_fee_percent)
      : effectiveRestaurant?.commission_percent != null ? parseFloat(effectiveRestaurant.commission_percent)
      : effectiveRestaurant?.platform_fee_percent != null ? parseFloat(effectiveRestaurant.platform_fee_percent)
      : 0;
    const commissionAmount = parseFloat((subtotal * (commissionPercent / 100)).toFixed(2));
    const computed = {
      finalTotal,
      finalTotalCents: Math.round(finalTotal * 100),
      commissionAmountCents: Math.round(commissionAmount * 100),
      commissionPercent,
    };
    // Debug in dev
    if (import.meta.env.MODE !== 'production') {
      console.debug('[Pay] totals computed', {
        restaurantId,
        commissionPercent,
        commissionAmountCents: computed.commissionAmountCents,
        finalTotalCents: computed.finalTotalCents,
        dest: detail.connected_account_id || detail.stripe_account_id,
        source: {
          detailCommission: detail.commission_percent,
          detailPlatformFee: detail.platform_fee_percent,
          ctxCommission: restaurantData?.commission_percent,
          ctxPlatformFee: restaurantData?.platform_fee_percent,
        }
      });
    }
    return computed;
  }, [getCartTotal, restaurantData, detail]);

  console.log(totals,"totals");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Debug guard to avoid skipping creation silently
        if (!restaurantId) throw new Error("Restaurant info missing. Go back and select items again.");
        const destinationAccountId = detail.connected_account_id || detail.stripe_account_id || restaurantData?.connected_account_id || restaurantData?.stripe_account_id;
        const meta = {
          restaurant_id: restaurantId,
          commission_percent: totals.commissionPercent,
        };
        if (destinationAccountId) {
          meta.destination_account_id = destinationAccountId;
          if (totals.commissionAmountCents > 0) {
            meta.application_fee_amount_cents = totals.commissionAmountCents;
          }
        }
        // Guard: Do not create PI below Stripe minimum; let user add more
        if (totals.finalTotalCents < 50) {
          throw new Error("Order total is below minimum charge amount. Please add more items.");
        }
        console.debug('[Pay] creating PI', { amount: totals.finalTotalCents, meta });
        const intent = await createStripePaymentIntent(totals.finalTotalCents, meta);
        if (!isMounted) return;
        setClientSecret(intent.clientSecret);
        setPaymentIntentId(intent.id);
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || "Failed to init payment");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [totals.finalTotalCents, restaurantId]);

  // Load addresses and require a default address
  const { data: allAddresses } = useAllAddresses({
    onSuccess: (res) => {
      const list = res?.data || [];
      // Prefer API list; fall back to window.user.addresses
      let effectiveList = list;
      if (effectiveList.length === 0 && window.user && Array.isArray(window.user.addresses)) {
        effectiveList = window.user.addresses;
      }

      const defaultAddr = effectiveList.find((a) => a.is_default) || effectiveList[0];
      setSelectedAddressId(defaultAddr?.id || null);

      if (effectiveList.length === 0) {
        setAddressModalOpen(true);
      }
    },
  });
  const hasUsableAddress = (() => {
    const list = allAddresses?.data || [];
    if (list.length > 0) return true;
    if (window.user && Array.isArray(window.user.addresses) && window.user.addresses.length > 0) return true;
    return false;
  })();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full h-12 rounded-full font-medium transition-all duration-200 bg-[#D6071B] text-white hover:bg-[#B8061A] active:bg-[#A0051A] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6071B] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Initializing Payment</h2>
          <p className="text-gray-600">Please wait while we prepare your checkout...</p>
        </div>
      </div>
    );
  }

  const options = { clientSecret };
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-[#D6071B] transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary - Left Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-[#D6071B]" />
                  Order Summary
                </h2>

                {/* Restaurant Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{effectiveRestaurant?.name || 'Restaurant'}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: 30-45 mins</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-gray-900">Items ({effectiveItems.length})</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {effectiveItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-semibold text-[#D6071B]">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${(totals.finalTotalCents / 100 - (detail.delivery_fee || 0) - (totals.finalTotalCents / 100 * (detail.tax || 0) / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${(detail.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({(detail.tax || 0)}%)</span>
                    <span className="font-medium">${((totals.finalTotalCents / 100) * (detail.tax || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>${(totals.finalTotalCents / 100).toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Delivery Address</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {hasUsableAddress ? 'Address confirmed' : 'Please add delivery address'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
                  <p className="text-gray-600">Secure payment powered by Stripe</p>
                </div>

                {!hasUsableAddress && (
                  <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium text-amber-800">Address Required</span>
                    </div>
                    <p className="text-amber-700 text-sm mt-1">Please add a default delivery address to continue with your order.</p>
            </div>
          )}

          {stripePromise && (
          <Elements stripe={stripePromise} options={options}>
              <Checkout
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                finalTotalCents={totals.finalTotalCents}
                restaurantId={restaurantId}
                disabled={!hasUsableAddress}
                deliveryAddressId={selectedAddressId}
                userAddresses={(allAddresses?.data || (window.user?.addresses || []))}
              />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        title="Add delivery address"
        description="You need a default delivery address before you can complete checkout. Go to your profile to add one."
        confirmText="Go to profile"
        cancelText="Cancel"
        onConfirm={() => {
          setAddressModalOpen(false);
          window.location.href = "/account-settings";
        }}
        onCancel={() => setAddressModalOpen(false)}
      />
    </>
  );
}


