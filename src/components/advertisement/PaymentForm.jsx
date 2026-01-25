import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { Shield } from "lucide-react";

// Create Stripe Payment Intent - uses env variable only
export async function createStripePaymentIntent(amountCents) {
  const secretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing VITE_STRIPE_SECRET_KEY environment variable");
  }

  const params = new URLSearchParams();
  params.append("amount", String(Math.round(amountCents)));
  params.append("currency", "usd");
  params.append("payment_method_types[]", "card");

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

export default function PaymentForm({ totalAmount, onPaymentSuccess, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || !stripe || !elements) return;

    setSubmitting(true);
    try {
      const amountCents = Math.round(totalAmount * 100);
      if (amountCents < 50) {
        throw new Error("Minimum amount is $0.50");
      }

      const { id: paymentIntentId, clientSecret } = await createStripePaymentIntent(amountCents);

      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not ready");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (error) throw new Error(error.message);

      const confirmedPaymentIntentId = paymentIntent?.id || paymentIntentId;
      onPaymentSuccess(confirmedPaymentIntentId);

    } catch (err) {
      toast.error(err?.message || "Payment failed");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  fontFamily: 'system-ui, sans-serif',
                  '::placeholder': { color: '#9CA3AF' },
                },
                invalid: { color: '#EF4444' },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || submitting || disabled}
        className="w-full mt-6 h-14 rounded-lg font-medium transition-all duration-200 bg-primary-50 text-white hover:bg-primary-50/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          `Submit - $${totalAmount.toFixed(2)}`
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>Your payment is secure and encrypted</span>
      </div>
    </form>
  );
}
