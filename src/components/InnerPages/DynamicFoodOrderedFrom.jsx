import { Minus, Plus, Trash2 } from "lucide-react";

export default function DynamicFoodOrderedFrom({ cartItems, totalPrice, onPlaceOrder, isPlacingOrder }) {
    const vatPrice = (totalPrice * 0.15).toFixed(2); // 15% VAT
    const platformFee = (totalPrice * 0.05).toFixed(2); // 5% Platform fee
    const finalTotal = (parseFloat(totalPrice) + parseFloat(vatPrice) + parseFloat(platformFee)).toFixed(2);
    
    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <h2 className="font-bold text-2xl mb-6">Food Ordered From</h2>
            
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
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Platform Fee (5%):</span>
                    <span>${platformFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>VAT (15%):</span>
                    <span>${vatPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-primary-1007 pt-3">
                    <span>Total:</span>
                    <span>${finalTotal}</span>
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
            <div className="mt-6">
                <button
                    onClick={onPlaceOrder}
                    disabled={isPlacingOrder}
                    className={`w-full py-3 px-4 rounded-full font-medium ${
                        isPlacingOrder
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-primary-50 hover:bg-primary-600'
                    } text-white transition-colors`}
                >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
}