import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import DealDiscountCard from "./DealDiscountCard";
import { Trash2 } from "lucide-react";
import CardOne from "./AdsCards/CardOne";

export default function DynamicCart({ restaurantData: propRestaurantData, ads = [] }) {
    const { items, getCartTotal, isCartEmpty, removeFromCart, updateItemQuantity, restaurantData: contextRestaurantData } = useCart();
    const navigate = useNavigate();
    
    // Use prop restaurant data if available, otherwise use context data
    const restaurantData = propRestaurantData || contextRestaurantData;

    if (isCartEmpty()) {
        return (
            <div className="border border-primary-1007 rounded-lg p-4">
                <div className="text-center">
                    <div className="mb-4">
                        <img
                            src="/images/empty-cart.png"
                            alt="Empty Cart"
                            className="w-24 h-24 mx-auto opacity-50"
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm">Add some delicious items to get started!</p>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    console.log(restaurantData,"restaurantData")
    // Get restaurant-specific fees or use defaults
    const deliveryFee = restaurantData?.delivery_fee ? parseFloat(restaurantData.delivery_fee) : 0;
    const platformFeePercentage = restaurantData?.platform_fee_percent ? parseFloat(restaurantData.platform_fee_percent) : 0;
    const vatPercentage = restaurantData?.tax ? parseFloat(restaurantData.tax) : 0;
    
    // Calculate fees
    const platformFee = (subtotal * (platformFeePercentage / 100)).toFixed(2);
    const vatPrice = (subtotal * (vatPercentage / 100)).toFixed(2);
    const finalTotal = (parseFloat(subtotal) + parseFloat(vatPrice) + parseFloat(platformFee) + deliveryFee).toFixed(2);

    return (
        <div className="border border-primary-1007 rounded-lg p-4">
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={`${item.id}-${JSON.stringify(item.selectedAddons)}`} className="border-b border-primary-1007 pb-6 last:border-b-0">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <img src={item.image || "/images/product-1.png"} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
                            </div>
                            <div className="w-full">
                                <h3 className="font-bold mb-2">{item.name}</h3>
                                {/* Selected Addons */}
                                {item.selectedAddons && Object.values(item.selectedAddons).some(addon => addon.selected) && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Add-ons:</p>
                                        <div className="ml-2 space-y-1">
                                            {Object.values(item.selectedAddons)
                                                .filter(addon => addon.selected)
                                                .map((addon, index) => (
                                                    <p key={index} className="text-sm text-gray-600">
                                                        • {addon.name} {addon.quantity > 1 && `(x${addon.quantity})`}
                                                        {addon.price > 0 && ` - $${(addon.price * addon.quantity).toFixed(2)}`}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                                {/* Special Instructions */}
                                {item.instructions && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">Note:</p>
                                        <p className="text-sm text-gray-600 ml-2">{item.instructions}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-4 w-full">
                                    <p className="font-semibold">${item.price}</p>
                                    <div className="flex justify-between items-center gap-2 ">
                                        <button
                                            disabled={item.quantity === 1}
                                            className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                            className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer"
                                        >
                                            +
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
            <div className="border-b border-primary-1007 pb-6 mb-6">
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-100 font-semibold">Sub Total</p>
                    <p className="text-primary-100 font-semibold">$ {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">Standard Delivery</p>
                    <p className="text-primary-1013">$ {deliveryFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">Platform Fee ({platformFeePercentage}%)</p>
                    <p className="text-primary-1013">$ {platformFee}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
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
                    <p className="font-semibold text-lg">Total <span className="font-bold text-xs">(Incl. VAT)</span></p>
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