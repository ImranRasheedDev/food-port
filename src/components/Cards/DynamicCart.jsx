import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function DynamicCart() {
    const { items, getCartTotal, isCartEmpty, removeFromCart, updateItemQuantity } = useCart();
    const navigate = useNavigate();

    if (isCartEmpty()) {
        return (
            <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
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
    const vatPrice = (subtotal * 0.15).toFixed(2); // 15% VAT
    const platformFee = (subtotal * 0.05).toFixed(2); // 5% Platform fee
    const finalTotal = (parseFloat(subtotal) + parseFloat(vatPrice) + parseFloat(platformFee)).toFixed(2);

    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <h2 className="font-bold text-2xl mb-6">Your Order</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                {items.map((item) => (
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
                                <div className="flex items-center gap-2 mt-2">
                                    <button 
                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
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

            {/* Confirm Order Button */}
            <button 
                onClick={() => navigate("/order-confirmation")} 
                className="bg-primary-50 text-white block w-full py-3 cursor-pointer rounded-full text-sm hover:bg-primary-600 transition-colors"
            >
                Confirm Order
            </button>
        </div>
    );
}