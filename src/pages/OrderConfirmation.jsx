import RestaurantAddress from "@/components/InnerPages/RestaurantAddress";
import PersonalDetail from "@/components/InnerPages/PersonalDetail";
import PaymentMethodSelect from "@/components/InnerPages/PaymentMethodSelect";
import FoodOrderedFrom from "@/components/InnerPages/FoodOrderedFrom";

export default function OrderConfirmation() {
    return (
        <>
            <div className="h-[150px]" />
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
                    <div className="lg:col-span-2 col-span-1 space-y-10">
                        <RestaurantAddress />
                        <PersonalDetail />
                        <PaymentMethodSelect />
                    </div>
                    <div className="lg:col-span-1 col-span-1">
                        <FoodOrderedFrom />
                    </div>
                </div>
            </div>
        </>
    )
}