import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { processImageUrl } from '@/lib/utils';
import { toast } from "react-toastify";

export default function OrderWaiting() {
    const location = useLocation();
    const initialSeconds = location.state?.etaSeconds ?? 45 * 60;
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const intervalRef = useRef(null);

    // useEffect(() => {
    //     intervalRef.current = setInterval(() => {
    //         setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    //     }, 1000);
    //     return () => clearInterval(intervalRef.current);
    // }, []);

    // const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    // const ss = String(secondsLeft % 60).padStart(2, '0');

    const handleGetDirection = async () => {
        try {
            // Get user address from window.user (already in localStorage)
            const userAddress = window.user?.address || window.user?.user_address;

            // Get restaurant address from localStorage
            const restaurantInfo = await window.helper.getStorageData("lastOrderRestaurant");

            if (!userAddress) {
                toast.error("User address not found. Please update your profile.");
                return;
            }

            if (!restaurantInfo || !restaurantInfo.address) {
                toast.error("Restaurant address not found.");
                return;
            }

            // Build Google Maps direction URL
            // Format: https://www.google.com/maps/dir/?api=1&origin=USER_ADDRESS&destination=RESTAURANT_ADDRESS
            const origin = encodeURIComponent(userAddress);
            const destination = encodeURIComponent(restaurantInfo.address);

            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

            // Open in new tab
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error("Error opening directions:", error);
            toast.error("Failed to open directions. Please try again.");
        }
    };

    return (
        <>
            <div className="h-[150px]" />

            <div className="text-center pb-10">
                <img src={processImageUrl("/images/preparing-order.png")} alt="order-waiting" className="mx-auto" />
                <h2 className="text-3xl font-semibold mb-2">Preparing Your Order</h2>
                <p className="text-primary-50 mb-5">Estimated Preparing time (45mins)</p>
                <button
                    onClick={handleGetDirection}
                    className="bg-primary-50 text-white gap-2 px-8 h-12 rounded-none hover:bg-primary-60 transition-colors"
                >
                    Get Direction
                </button>
            </div>
        </>
    )
}