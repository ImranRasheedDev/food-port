
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentMethodSelect() {
    const [selectedPayment, setSelectedPayment] = useState("visa");

    const paymentMethods = [
        {
            id: "visa",
            name: "Visa",
            image: "/images/visa-card.png"
        },
        {
            id: "mastercard",
            name: "Master Card",
            image: "/images/master-card.png"
        },
        {
            id: "cash",
            name: "Cash",
            image: "/images/bi_cash-coin.png"
        }
    ];

    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        navigate("/add-card");
    };

    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <div className="space-y-8 border-b border-primary-1007 pb-8">
                <h1 className=" font-bold text-2xl ">Payment</h1>
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-center space-x-8 w-full cursor-pointer"
                        onClick={() => setSelectedPayment(method.id)}
                    >
                        <div>
                            <img src={method.image} alt="payment-method-select" />
                        </div>
                        <div>
                            <p className="font-medium">{method.name}</p>
                        </div>
                        <div className="ml-auto">
                            <div
                                className={`rounded-full w-5 h-5 ${selectedPayment === method.id
                                    ? 'border-[5px] border-primary-50'
                                    : 'border-2 border-primary-50'
                                    }`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-10">
                <button type="submit" onClick={handlePlaceOrder} className="bg-primary-50 rounded-full h-14 w-full text-white cursor-pointer">Place Order</button>
            </div>
        </div>
    )
}