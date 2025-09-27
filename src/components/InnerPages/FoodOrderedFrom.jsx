export default function FoodOrderedFrom() {
    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <h1 className="font-bold text-2xl mb-4">Food Ordered From</h1>
            <div>
                <h2 className="font-semibold mb-3">KFC - New York</h2>
                <p className="text-primary-200 font-medium lg:w-[60%]">
                    Mc Arabia Chicken with Regular Drink
                    & Regular Fries
                </p>
                <div className="space-y-4 mt-4">
                    <div className="flex justify-between">
                        <p>Platform Fee</p>
                        <p>$ 1.00</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Order Number</p>
                        <p>32346</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold text-primary-50 text-lg">Sub Total</p>
                        <p className="font-semibold text-primary-50 text-lg">$ 15.00</p>
                    </div>
                </div>
            </div>
        </div>
    )
}