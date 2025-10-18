import { Clock, MapPin, Phone } from "lucide-react";

export default function DynamicRestaurantAddress({ restaurantData, selectedAddress, onAddressChange }) {
    const restaurantName = restaurantData?.name || 'Restaurant';
    const restaurantAddress = restaurantData?.address || 'Restaurant address not available';
    const restaurantPhone = restaurantData?.phone || restaurantData?.contact_number || '+1234567890';
    const restaurantCity = restaurantData?.city || 'Restaurant City';

    const latitude = restaurantData?.latitude || restaurantData?.lat;
    const longitude = restaurantData?.longitude || restaurantData?.lng;
    const mapEmbedUrlFromCoords = latitude && longitude
        ? `https://www.google.com/maps?q=${encodeURIComponent(latitude + "," + longitude)}&z=15&output=embed`
        : null;
    const mapEmbedUrlFromAddress = !mapEmbedUrlFromCoords && restaurantAddress
        ? `https://www.google.com/maps?q=${encodeURIComponent(restaurantAddress)}&z=15&output=embed`
        : null;
    const mapEmbedUrl = restaurantData?.map_iframe_url || mapEmbedUrlFromCoords || mapEmbedUrlFromAddress;

    return (
        <div className="border bg-primary-995 border-primary-1007 rounded-lg p-4">
            <div>
                <h1 className="font-bold text-2xl mb-6">Restaurant Address</h1>
                {mapEmbedUrl ? (
                    <iframe
                        title="Restaurant location"
                        src={mapEmbedUrl}
                        className="w-full h-[260px] rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                ) : (
                    <div className="w-full h-[260px] bg-gray-100 rounded-lg" />
                )}
            </div>
            <div>
                <div className="flex gap-x-2 border-b border-primary-1007 py-8">
                    <MapPin className="w-6 h-6 mt-1" />
                    <div>
                        <p className="font-bold text-xl">{restaurantAddress}</p>
                        <p className="text-primary-1013">{restaurantCity}</p>
                    </div>
                </div>
                <div className="flex gap-x-2 justify-between pt-8 pb-8">
                    <div>
                        <p className="font-semibold text-xl">Estimated Preparing time</p>
                    </div>
                    <div className="flex items-center gap-x-2 ">
                        <Clock className="text-primary-50 w-5 h-5" />
                        <span className="text-primary-1016">45 minutes</span>
                    </div>
                </div>
                <div className="space-y-6">
                    <p className="font-semibold text-xl">Restaurant Details</p>
                    <p className="text-primary-100">{restaurantName}</p>
                    <div className="flex items-center gap-x-2 justify-between">
                        <a href={`tel:${restaurantPhone}`} className="text-primary-100">Call</a>
                        <a href={`tel:${restaurantPhone}`} className="text-primary-100"><Phone className="w-5 h-5" /></a>
                    </div>
                    <div className="flex items-center gap-x-2 justify-between">
                        <a href={`https://wa.me/${(restaurantPhone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-100">WhatsApp</a>
                        <a href={`https://wa.me/${(restaurantPhone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="none"
                                viewBox="0 0 30 30"
                            >
                                <path
                                    fill="url(#paint0_linear_224_4188)"
                                    d="M.64 14.82c0 2.521.663 4.982 1.925 7.151L.52 29.383l7.644-1.988a14.5 14.5 0 0 0 6.89 1.74h.007c7.947 0 14.416-6.416 14.42-14.303a14.16 14.16 0 0 0-4.22-10.12C22.538 2.01 18.918.52 15.06.519 7.111.518.643 6.934.64 14.82"
                                ></path>
                                <path
                                    fill="#ECECEC"
                                    d="M.125 14.816c0 2.611.687 5.16 1.994 7.407L0 29.901l7.918-2.06a15 15 0 0 0 7.138 1.803h.007c8.232 0 14.934-6.647 14.937-14.816a14.67 14.67 0 0 0-4.371-10.483C22.809 1.545 19.059.002 15.063 0 6.829 0 .129 6.647.125 14.816m4.716 7.02-.296-.465a12.2 12.2 0 0 1-1.898-6.554C2.65 8.027 8.22 2.502 15.067 2.502a12.38 12.38 0 0 1 8.778 3.612 12.2 12.2 0 0 1 3.633 8.713c-.003 6.79-5.572 12.315-12.415 12.315h-.005a12.5 12.5 0 0 1-6.32-1.717l-.453-.267-4.699 1.223z"
                                ></path>
                                <path
                                    fill="#fff"
                                    d="M11.33 8.622c-.28-.617-.575-.63-.84-.64-.218-.01-.467-.009-.716-.009s-.653.093-.995.464c-.342.37-1.306 1.266-1.306 3.088s1.337 3.583 1.524 3.83c.186.247 2.582 4.106 6.375 5.59 3.153 1.234 3.795.988 4.479.927.684-.062 2.208-.896 2.519-1.76.311-.865.311-1.606.218-1.761s-.342-.247-.716-.432c-.373-.186-2.208-1.082-2.55-1.205-.342-.124-.59-.185-.84.185-.249.37-.963 1.205-1.181 1.452s-.436.278-.809.093-1.575-.577-3.001-1.838c-1.11-.982-1.859-2.194-2.077-2.565-.217-.37-.023-.57.164-.755.168-.166.373-.433.56-.649.186-.216.248-.37.373-.617.125-.248.062-.464-.031-.65-.094-.184-.819-2.016-1.15-2.748"
                                ></path>
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_224_4188"
                                        x1="1448.56"
                                        x2="1448.56"
                                        y1="2887.09"
                                        y2="0.518"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="#1FAF38"></stop>
                                        <stop offset="1" stopColor="#60D669"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}