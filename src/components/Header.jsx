import { useState } from "react";
import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LayoutWrapper from "./layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItemCount, items, restaurantData } = useCart();
  const navigate = useNavigate();

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  const handleCartClick = () => {
    if (getCartItemCount() <= 0) {
      navigate('/cart');
      return;
    }
    const rid = restaurantData?.id || items?.[0]?.restaurantId || items?.[0]?.restaurant_id;
    if (rid) {
      navigate(`/resturants-detail/${rid}`);
    } else {
      navigate('/cart');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <LayoutWrapper> 
      <div className=" py-4 flex items-center justify-between">
        {/* Mobile: Menu + Logo */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Menu Icon */}

          {/* Logo */}
          <Link to="/" onClick={closeDrawer}>
            <img src={processImageUrl("/images/logo.png")} alt="Logo" className="h-10" />
          </Link>

          <button
            onClick={toggleDrawer}
            aria-label="Toggle Menu"
            className="text-white"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={processImageUrl("/images/logo.png")} alt="Logo" className="h-10" />
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/auth/login"
              className="flex justify-center items-center border bg-transparent border-white text-white rounded-full px-12 h-12 hover:bg-white hover:text-black"
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="flex justify-center items-center border border-primary-50 bg-primary-50 hover:bg-red-600 text-white rounded-full h-12 px-12"
            >
              Sign-Up
            </Link>
            <div className="flex items-center space-x-1 text-white cursor-pointer pl-6">
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="relative" onClick={handleCartClick}>
              <ShoppingCart className="w-6 h-6 text-white cursor-pointer" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-50 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {getCartItemCount()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      </LayoutWrapper>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 h-screen"
            onClick={closeDrawer}
          ></div>

          {/* Drawer Content */}
          <div className="relative z-[9999] w-72 max-w-[80%] h-screen bg-black text-white p-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={closeDrawer}
              aria-label="Close Menu"
              className="absolute top-4 right-4 text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Links */}
            <nav className="mt-12 space-y-6 ">
              <Link
                to="/auth/login"
                onClick={closeDrawer}
                className="block text-lg hover:text-primary-50"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                onClick={closeDrawer}
                className="block text-lg hover:text-primary-50"
              >
                Sign-Up
              </Link>
              <button
                onClick={closeDrawer}
                className="flex items-center space-x-1 text-lg hover:text-primary-50"
              >
                <span>EN</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="flex items-center text-lg hover:text-primary-50" onClick={handleCartClick}>
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-50 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {getCartItemCount()}
                    </span>
                  )}
                </div>
                Cart
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
