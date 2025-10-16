import { Minus, Plus, Trash2 } from "lucide-react";

export default function DynamicFoodOrderedFrom({ cartItems, totalPrice, onPlaceOrder, isPlacingOrder, canPlaceOrder, hasAddress, restaurantData }) {
    const deliveryFee = restaurantData?.delivery_fee ? parseFloat(restaurantData.delivery_fee) : 0;
    const platformFeePercentage = restaurantData?.commission_percent ? parseFloat(restaurantData.commission_percent) : 0;
    const vatPercentage = restaurantData?.tax ? parseFloat(restaurantData.tax) : 0;
    const platformFee = (totalPrice * (platformFeePercentage / 100)).toFixed(2);
    const vatPrice = (totalPrice * (vatPercentage / 100)).toFixed(2);
    const finalTotal = (parseFloat(totalPrice) + parseFloat(vatPrice) + parseFloat(platformFee) + deliveryFee).toFixed(2);
    
    return (
        <div className="border border-primary-1007 rounded-lg p-4">
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                    <div key={`${item.id}-${JSON.stringify(item.selectedAddons)}`} className="border-b border-primary-1007 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                
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
                            </div>
                            
                            <div className="text-right ml-4">
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-b border-primary-1007 pb-6 mb-6">
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-100 font-semibold">Sub Total</p>
                    <p className="text-primary-100 font-semibold">$ {totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">Standard Delivery</p>
                    <p className="text-primary-1013">$ {deliveryFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">  Commission Fee ({platformFeePercentage}%)</p>
                    <p className="text-primary-1013">$ {platformFee}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">VAT ({vatPercentage}%)</p>
                    <p className="text-primary-1013">$ {vatPrice}</p>
                </div>
            </div>

            {/* Order Number */}
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-lg">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="pt-2 pb-3">
                <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-lg">Total <span className="font-bold text-xs">(Incl. VAT)</span></p>
                    <p className="font-semibold">$ {finalTotal}</p>
                </div>
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