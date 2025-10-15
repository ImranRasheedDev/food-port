import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// Function to create Stripe payment intent directly from frontend
const createStripePaymentIntent = async (paymentData) => {
  try {
    // Calculate platform fee (5% of total amount)
    const platformFee = Math.round(paymentData.amount * 0.05);
    const totalAmount = paymentData.amount + platformFee;

    // Initialize Stripe with your public key
    const stripe = window.Stripe("pk_test_your_stripe_public_key"); // Replace with your actual Stripe public key

    // Create payment method
    const { paymentMethod, error: paymentMethodError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: {
          number: paymentData.cardNumber,
          exp_month: parseInt(paymentData.expiryDate.split("/")[0]),
          exp_year: parseInt("20" + paymentData.expiryDate.split("/")[1]),
          cvc: paymentData.cvc,
        },
        billing_details: {
          name: paymentData.metadata.cardholder_name,
        },
      });

    if (paymentMethodError) {
      throw new Error(paymentMethodError.message);
    }

    // Create payment intent
    const { paymentIntent, error: paymentIntentError } =
      await stripe.createPaymentIntent({
        amount: totalAmount,
        currency: paymentData.currency,
        payment_method: paymentMethod.id,
        confirmation_method: "manual",
        confirm: true,
        metadata: {
          cardholder_name: paymentData.metadata.cardholder_name,
          card_last_four: paymentData.metadata.card_last_four,
        },
      });

    if (paymentIntentError) {
      throw new Error(paymentIntentError.message);
    }

    return {
      id: paymentIntent.id,
      amount: totalAmount,
      platform_fee: platformFee,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error);
    throw error;
  }
};

export default function AddCardDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { returnTo, cartData } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardholderName: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data) => {
    console.log("Card Details:", data);

    // If we came from order confirmation, create payment intent and return
    if (returnTo && location.state?.totalPrice) {
      setIsProcessing(true);
      try {
        // Create Stripe payment intent
        const paymentIntent = await createStripePaymentIntent({
          amount: Math.round(location.state.totalPrice * 100), // Convert to cents
          currency: "usd",
          cardNumber: data.cardNumber.replace(/\s/g, ""), // Remove spaces
          expiryDate: data.expiryDate,
          cvc: data.cvc,
          metadata: {
            cardholder_name: data.cardholderName,
            card_last_four: data.cardNumber.replace(/\s/g, "").slice(-4),
          },
        });

        // Return with payment intent ID and platform fee from Stripe
        navigate(returnTo, {
          state: {
            paymentIntentId: paymentIntent.id,
            platformFee: paymentIntent.platform_fee / 100, // Convert back to dollars
          },
        });
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Failed to process payment. Please try again.");
        setIsProcessing(false);
      }
    } else {
      // Direct navigation to add card
      navigate("/order-waiting");
    }
  };

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Format CVC (only numbers, max 4 digits)
  const formatCVC = (value) => {
    return value.replace(/[^0-9]/gi, "").substring(0, 4);
  };

  // Validate expiry date (must be in future)
  const validateExpiryDate = (value) => {
    if (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return "Please enter a valid expiry date (MM/YY)";
    }

    const [month, year] = value.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return "Card has expired";
    }

    return true;
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-10">Add Card Details</h2>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label className="mb-4">Card Number</Label>
          <Input
            type="text"
            placeholder="1234 5678 9012 3456"
            className={`bg-primary-1017 h-14 border rounded-none ${
              errors.cardNumber ? "border-red-500" : ""
            }`}
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^[0-9\s]{13,19}$/,
                message: "Please enter a valid card number",
              },
              validate: (value) => {
                const digitsOnly = value.replace(/\s/g, "");
                if (digitsOnly.length < 13 || digitsOnly.length > 19) {
                  return "Card number must be between 13-19 digits";
                }
                return true;
              },
            })}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setValue("cardNumber", formatted);
            }}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardNumber.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-10">
          <div>
            <Label className="mb-4">MM/YY</Label>
            <Input
              type="text"
              placeholder="MM/YY"
              className={`bg-primary-1017 h-14 border rounded-none ${
                errors.expiryDate ? "border-red-500" : ""
              }`}
              {...register("expiryDate", {
                required: "Expiry date is required",
                validate: validateExpiryDate,
              })}
              onChange={(e) => {
                const formatted = formatExpiryDate(e.target.value);
                setValue("expiryDate", formatted);
              }}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-4">CVC</Label>
            <Input
              type="text"
              placeholder="123"
              className={`bg-primary-1017 h-14 border rounded-none ${
                errors.cvc ? "border-red-500" : ""
              }`}
              {...register("cvc", {
                required: "CVC is required",
                minLength: {
                  value: 3,
                  message: "CVC must be at least 3 digits",
                },
                maxLength: {
                  value: 4,
                  message: "CVC must be at most 4 digits",
                },
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "CVC must contain only numbers",
                },
              })}
              onChange={(e) => {
                const formatted = formatCVC(e.target.value);
                setValue("cvc", formatted);
              }}
            />
            {errors.cvc && (
              <p className="text-red-500 text-sm mt-1">{errors.cvc.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label className="mb-4">Name of card holder</Label>
          <Input
            type="text"
            placeholder="John Doe"
            className={`bg-primary-1017 h-14 border rounded-none ${
              errors.cardholderName ? "border-red-500" : ""
            }`}
            {...register("cardholderName", {
              required: "Cardholder name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Name can only contain letters and spaces",
              },
            })}
          />
          {errors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardholderName.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="termsAccepted"
            control={control}
            rules={{ required: "You must accept the terms and conditions" }}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="terms">I agree to the terms and conditions</Label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
        )}
        <div>
          <button
            type="submit"
            disabled={isProcessing}
            className={`rounded-full h-14 w-full text-white cursor-pointer ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-50 hover:bg-primary-600"
            }`}
          >
            {isProcessing ? "Processing..." : "Done"}
          </button>
        </div>
      </form>
    </div>
  );
}
