import { useState } from "react";
import { ChevronDown, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LayoutWrapper from "./layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartItemCount, items, restaurantData, openCartDrawer } = useCart();
  const navigate = useNavigate();

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  const handleCartClick = () => {
    openCartDrawer();
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
            <div className="flex items-center space-x-10">
              <Link
                to="/"
                className="text-white"
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="text-white"
              >
                About us
              </Link>
              <Link
                to="/contact-us"
                className="text-white"
              >
                Contact us
              </Link>
              <Link
                to="/become-a-partner"
                className="text-white"
              >
                Become a partner
              </Link>
              <Link
                to="/auth/login"
                className="text-white"
              >
                Login
              </Link>
              {/* <Link
                to="/auth/signup"
                className="flex justify-center items-center border border-primary-50 bg-primary-50 hover:bg-red-600 text-white rounded-full h-12 px-12"
              >
                Sign-Up
              </Link> */}
              {/* <div className="flex items-center space-x-1 text-white cursor-pointer pl-6">
                <span>EN</span>
                <ChevronDown className="w-4 h-4" />
              </div> */}
              <div className="relative" onClick={handleCartClick}>
                {/* <ShoppingCart className="w-6 h-6 text-white cursor-pointer" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="none"
                  viewBox="0 0 26 26"
                  className="cursor-pointer"
                >
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M13.002 2.167c2.752 0 4.79 1.788 4.931 4.505h3.57a1.083 1.083 0 0 1 1.073 1.236l-1.857 12.828c-.077.534-.534.93-1.073.93H6.36c-.54 0-.997-.396-1.073-.93L3.43 7.909a1.083 1.083 0 0 1 1.072-1.236l3.474.006c.14-2.717 2.276-4.511 5.027-4.511m6.022 15.437H6.98a.433.433 0 0 0-.429.495l.225 1.57c.03.214.214.373.43.373H18.8a.43.43 0 0 0 .428-.372l.225-1.571a.433.433 0 0 0-.429-.495m1.354-9.307H5.625a.433.433 0 0 0-.433.433c0 .286.001.041.004.061l.998 6.816c.031.214.214.372.43.372H19.38a.43.43 0 0 0 .429-.372l.999-6.816a.433.433 0 0 0-.43-.494m-7.376-4.61c-1.718 0-3.084.996-3.347 2.598a.334.334 0 0 0 .325.393l5.96-.006a.32.32 0 0 0 .32-.322c0-.02-.05-.043-.005-.059-.379-1.608-1.53-2.604-3.253-2.604"
                    clipRule="evenodd"
                  ></path>
                </svg>
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
              {/* <button
                onClick={closeDrawer}
                className="flex items-center space-x-1 text-lg hover:text-primary-50"
              >
                <span>EN</span>
                <ChevronDown className="w-4 h-4" />
              </button> */}
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