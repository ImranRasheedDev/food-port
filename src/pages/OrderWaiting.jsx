import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function OrderWaiting() {
    const location = useLocation();
    const initialSeconds = location.state?.etaSeconds ?? 45 * 60;
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');

    return (
        <>
            <div className="h-[150px]" />
            {secondsLeft > 0 ? (
                <div className="text-center pb-10">
                    <img src="/images/preparing-order.png" alt="order-waiting" className="mx-auto" />
                    <h2 className="text-3xl font-semibold mb-2">Preparing Your Order</h2>
                    <p className="text-primary-50">Estimated time {mm}:{ss}</p>
                </div>
            ) : (
                <div className="text-center pb-10">
                    <img
                        src="/images/empty-cart.png"
                        alt="Empty Cart"
                        className="mx-auto w-24 h-24 opacity-50"
                    />
                    <h2 className="text-2xl font-semibold mt-4">Your cart is empty</h2>
                </div>
            )}
        </>
    )
}