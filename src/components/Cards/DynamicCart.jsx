import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import DealDiscountCard from "./DealDiscountCard";
import { Trash2, Minus, Plus } from "lucide-react";
import CardOne from "./AdsCards/CardOne";
import { processImageUrl, getStaticImagePath } from "@/lib/utils";
import { useMemo, useState } from "react";

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
  } = useCart();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});

  // Use prop restaurant data if available, otherwise use context data
  const restaurantData = propRestaurantData || contextRestaurantData;

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Get processed image URL with error handling for each item
  const getImageSrc = (item) => {
    const itemKey = `${item.id}-${JSON.stringify(item.selectedAddons)}`;
    if (imageErrors[itemKey] || !item.image) {
      return processImageUrl("/images/placeholder1.jpg"); // Use processImageUrl for consistent path handling
    }
    return processImageUrl(item.image, "/images/placeholder1.jpg");
  };

  if (isCartEmpty()) {
    return (
      <div className="border h-[960px] flex flex-col justify-center items-center p-4 border-primary-1007 rounded-lg p-4">
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
  const platformFeePercentage = restaurantData?.commission_percent
    ? parseFloat(restaurantData.commission_percent)
    : 0;
  const vatPercentage = restaurantData?.tax
    ? parseFloat(restaurantData.tax)
    : 0;

  // Calculate fees
  const platformFee = (subtotal * (platformFeePercentage / 100)).toFixed(2);
  const vatPrice = (subtotal * (vatPercentage / 100)).toFixed(2);
  const finalTotal = (
    parseFloat(subtotal) +
    parseFloat(vatPrice) +
    parseFloat(platformFee) +
    deliveryFee
  ).toFixed(2);

 


  return (
    <div className="border  border-primary-1007 rounded-lg p-4">
      {/* Cart Items */}
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div
            key={`${item.id}-${JSON.stringify(item.selectedAddons)}`}
            className="border-b border-primary-1007 pb-6 last:border-b-0"
          >
            <div className="flex gap-3 ">
              <div className="flex-shrink-0 ">
                <img
                  src={getImageSrc(item)}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={() => handleImageError(`${item.id}-${JSON.stringify(item.selectedAddons)}`)}
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
        <div className="flex justify-between items-center mt-2">
          <p className="text-primary-1013">
            Commission Fee ({platformFeePercentage}%)
          </p>
          <p className="text-primary-1013">$ {platformFee}</p>
        </div>
        <div className="flex justify-between items-center mb-6 mt-2">
          <p className="text-primary-1013">VAT ({vatPercentage}%)</p>
          <p className="text-primary-1013">$ {vatPrice}</p>
        </div>
      </div>

      {/* Ads inside cart */}
      {Array.isArray(ads) && ads.length > 0 && (
        <div className="space-y-6 mb-6">
          {ads.length > 3 && (
            <CardOne
              campaignData={ads[3]}
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
            />
          )}
          {ads.slice(4, 7).map((banner, index) => (
            <DealDiscountCard
              key={banner.id || index}
              campaignData={banner}
              cardIndex={index}
            />
          ))}
        </div>
      )}

      {/* Total and Confirm */}
      <div className="pt-2 pb-3">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg">
            Total <span className="font-bold text-xs">(Incl. VAT)</span>
          </p>
          <p className="font-semibold">$ {finalTotal}</p>
        </div>
        <button
          onClick={() => navigate("/order-confirmation")}
          className="bg-primary-50 text-white block w-full py-3 cursor-pointer rounded-full text-sm"
        >
          Confirm order
        </button>
      </div>
    </div>
  );
}
