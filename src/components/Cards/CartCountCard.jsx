import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import DealDiscountCard from "./DealDiscountCard";

export default function CartCountCard({ image, productName, price, count, totalPrice, vatPrice, platformFee }) {
    const [countValue, setCountValue] = useState(count);
    return (
        <div className="border border-primary-1007 rounded-lg p-4">
            <div className="flex gap-3 border-b border-primary-1007 pb-6">
                <div className="flex-shrink-0">
                    <img src={image} alt="cart-count-card" className="w-32 h-32 object-cover rounded-lg" />
                </div>
                <div className="w-full">
                    <h1 className="font-bold mb-2">{productName}</h1>
                    <div className="flex justify-between items-center mt-16 w-full">
                        <p>$ {price}</p>
                        <div className="flex justify-between items-center gap-2 ">
                            <button disabled={countValue === 1} className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer" onClick={() => setCountValue(countValue - 1)}>
                                <Minus className="w-4 h-4 text-primary-50" />
                            </button>
                            <span className="font-bold">{countValue}</span>
                            <button onClick={() => setCountValue(countValue + 1)} className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer">
                                <Plus className="w-4 h-4 text-primary-50" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-b border-primary-1007 pb-6 mb-6">
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-100 font-semibold">
                        Sub Total
                    </p>
                    <p className="text-primary-100 font-semibold">
                        $ {totalPrice}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">
                        VAT
                    </p>
                    <p className="text-primary-1013">
                        $ {vatPrice}
                    </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <p className="text-primary-1013">
                        Platform Fee
                    </p>
                    <p className="text-primary-1013">
                        $ {platformFee}
                    </p>
                </div>
            </div>
            <div className="space-y-6">
                <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={2} />
                <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={0} />
                <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={1} />
            </div>
        </div>
    )
}