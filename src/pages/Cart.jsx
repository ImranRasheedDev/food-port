import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { getStaticImagePath } from "@/lib/utils";

export default function Cart() {
  const { isCartEmpty, items, restaurantData } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCartEmpty() && items && items.length > 0) {
      const restaurantId = restaurantData?.id || items[0]?.restaurantId || items[0]?.restaurant_id;
      if (restaurantId) {
        navigate(`/resturants-detail/${restaurantId}`);
      }
    }
  }, [isCartEmpty, items, restaurantData, navigate]);

  if (!isCartEmpty()) {
    return null;
  }

  return (
    <>
      <div className="h-[150px]" />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <img
            src={getStaticImagePath("/images/empty-cart.png")}
            alt="Empty Cart"
            className="w-28 h-28 mx-auto opacity-70"
          />
          <h3 className="text-lg font-semibold text-gray-700 mt-4">Your cart is empty</h3>
        </div>
      </div>
    </>
  );
}


