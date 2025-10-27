import { useState, useEffect } from "react";
import { processImageUrl } from "@/lib/utils";

export default function PaymentMethodSelect({
  paymentMethod,
  onPaymentMethodChange,
  onPlaceOrder,
  isPlacingOrder,
  canPlaceOrder,
  hasAddress,
}) {
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Determine display value based on paymentMethod prop
  const getDisplaySelectedPayment = () => {
    if (paymentMethod === "card") {
      // If paymentMethod is card, show the currently selected card or default to visa
      return selectedPayment || "visa";
    }
    return paymentMethod;
  };

  // Initialize and sync with parent state
  useEffect(() => {
    if (paymentMethod === "card" && !selectedPayment) {
      setSelectedPayment("visa");
    } else if (paymentMethod && paymentMethod !== "card") {
      setSelectedPayment(paymentMethod);
    }
  }, [paymentMethod]);

  const paymentMethods = [
    {
      id: "visa",
      name: "Visa",
      image: processImageUrl("/images/visa-card.png"),
    },
    {
      id: "mastercard",
      name: "Master Card",
      image: processImageUrl("/images/master-card.png"),
    },
    // {
    //     id: "cash",
    //     name: "Cash",
    //     image: processImageUrl("/images/bi_cash-coin.png")
    // }
  ];

  const handleSelect = (id) => {
    // Prevent unnecessary updates if already selected
    if (getDisplaySelectedPayment() === id) return;
    
    setSelectedPayment(id);
    if (typeof onPaymentMethodChange === "function") {
      onPaymentMethodChange(id === "visa" || id === "mastercard" ? "card" : id);
    }
  };

  return (
    <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
      <div className="space-y-8 border-b border-primary-1007 pb-8">
        <h1 className=" font-bold text-2xl ">Payment</h1>
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-center space-x-8 w-full cursor-pointer p-2 rounded-lg transition-colors duration-200 ${
              getDisplaySelectedPayment() === method.id ? 'bg-primary-100/10' : 'hover:bg-primary-100/5'
            }`}
            onClick={() => handleSelect(method.id)}
          >
            <div>
              <img src={method.image} alt="payment-method-select" />
            </div>
            <div>
              <p className="font-medium">{method.name}</p>
            </div>
            <div className="ml-auto">
              <div
                className={`relative w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                  getDisplaySelectedPayment() === method.id
                    ? "border-primary-50 bg-primary-50"
                    : "border-primary-50 bg-transparent"
                }`}
              >
                {getDisplaySelectedPayment() === method.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Place Order Button */}
      <div className="pt-4">
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || !canPlaceOrder || !hasAddress}
          className={`w-full py-3 px-4 rounded-full font-medium ${
            isPlacingOrder || !canPlaceOrder
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-50 hover:bg-primary-600'
          } text-white transition-colors`}
        >
          {isPlacingOrder ? 'Processing...' : (!hasAddress ? 'Select Address' : (!canPlaceOrder ? 'Select Payment Method' : 'Place Order'))}
        </button>
      </div>
    </div>
  );
}
