import { Clock, MapPin, Phone } from "lucide-react";

export default function DynamicRestaurantAddress({ restaurantData, selectedAddress, onAddressChange }) {
    const restaurantName = restaurantData?.name || 'Restaurant';
    const restaurantAddress = restaurantData?.address || 'Restaurant address not available';
    const restaurantPhone = restaurantData?.phone || restaurantData?.contact_number || '+1234567890';
    const restaurantCity = restaurantData?.city || 'Restaurant City';
    
    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <h1 className="font-bold text-2xl mb-6">Restaurant Details</h1>
            
            <div className="space-y-6">
                {/* Restaurant Name */}
                <div>
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">{restaurantName}</h2>
                    <p className="text-gray-600">{restaurantCity}</p>
                </div>

                {/* Restaurant Address */}
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-gray-700 font-medium">Address</p>
                        <p className="text-gray-600 text-sm">{restaurantAddress}</p>
                    </div>
                </div>

                {/* Estimated Delivery Time */}
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-gray-700 font-medium">Estimated Delivery</p>
                        <p className="text-gray-600 text-sm">30-45 minutes</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-gray-700 font-medium">Contact</p>
                        <div className="flex gap-4 mt-1">
                            <a 
                                href={`tel:${restaurantPhone}`} 
                                className="text-primary-100 hover:text-primary-200 text-sm transition-colors"
                            >
                                Call
                            </a>
                            <a 
                                href={`https://wa.me/${restaurantPhone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-100 hover:text-primary-200 text-sm transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Delivery Address Selection */}
                {selectedAddress && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium mb-2">Delivery Address</p>
                        <p className="text-gray-600 text-sm">
                            {selectedAddress.address_line_1}
                            {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                            {selectedAddress.city && `, ${selectedAddress.city}`}
                            {selectedAddress.postal_code && `, ${selectedAddress.postal_code}`}
                        </p>
                        {selectedAddress.landmark && (
                            <p className="text-gray-500 text-xs mt-1">Landmark: {selectedAddress.landmark}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}