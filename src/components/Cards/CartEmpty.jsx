export default function CartEmpty() {
    return (
        <div className="border border-primary-1007 rounded-lg h-[960px] flex flex-col justify-between p-4">
            <div>
            </div>
            <div className="text-center">
                <img src="/images/empty-cart.png" alt="cart-empty" className="mx-auto" />
                <h2 className="text-lg font-bold mb-3">Hungry?</h2>
                <p className="text-sm ">You haven't added anything <br />
                    to your cart!</p>
            </div>
            <div>
                <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-lg">Total <span className="font-bold text-xs">(Incl. VAT)</span></p>
                    <p className="font-semibold">$. 0.00</p>
                </div>
                <button disabled className="bg-primary-1012 text-white block w-full py-2 rounded-full text-sm">Confirm order</button>
            </div>
        </div>
    )
}