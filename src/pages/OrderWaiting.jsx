import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { processImageUrl } from '@/lib/utils';
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

    return (
        <>
            <div className="h-[150px]" />

                <div className="text-center pb-10">
                    <img src={processImageUrl("/images/preparing-order.png")} alt="order-waiting" className="mx-auto" />
                    <h2 className="text-3xl font-semibold mb-2">Preparing Your Order</h2>
                    <p className="text-primary-50">Estimated Preparing time (45mins)</p>
                </div>
            </>
    )
}