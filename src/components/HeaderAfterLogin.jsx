import { useState } from "react";
import {
  ChevronDown,
  ShoppingCart,
  Menu,
  X,
  MapPin,
  Globe,
  Heart,
  User,
  LayoutDashboard,
  Megaphone,
  FileCheck2,
} from "lucide-react";
import { Link, Links, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
export default function HeaderAfterLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    window.helper.sweetAlert(
      "warning",
      "Are you sure?",
      "You want to logout?",
      async (result) => {
        if (result.isConfirmed) {
          await window.helper.removeStorageData();
          window.user = "";
          window.location.reload();
        }
      }
    );
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile: Menu + Logo */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Menu Icon */}

          {/* Logo */}
          <Link to="/" onClick={closeDrawer}>
            <img src="/images/footer-logo.png" alt="Logo" className="h-10" />
          </Link>

          <button
            onClick={toggleDrawer}
            aria-label="Toggle Menu"
            className="text-primary-950"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src="/images/footer-logo.png" alt="Logo" className="h-10" />
          </Link>
          <div className="flex items-center gap-x-1">
            <MapPin className="text-primary-950" />
            <p className="text-primary-950">
              Your address : 13th Street 47 W 13th St, New York, NY 10011, USA
            </p>
          </div>
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 cursor-pointer border-0 ouline-none">
                <User />
                {window.user?.name}
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"w-3xs shadow-lg p-0"}>
                <DropdownMenuItem
                  className={"p-0 bg-white hover:bg-primary-990"}
                >
                  <Link
                    to={""}
                    className="flex items-center gap-x-2 w-full p-5"
                  >
                    <LayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"p-0 bg-white hover:bg-primary-990"}
                >
                  <Link
                    to={""}
                    className="flex items-center gap-x-2 w-full p-5"
                  >
                    <User /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"p-0 bg-white hover:bg-primary-990"}
                >
                  <Link
                    to={""}
                    className="flex items-center gap-x-2 w-full p-5"
                  >
                    <Megaphone /> Advertise yourself
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={"m-0"} />
                <DropdownMenuItem
                  className={"p-0 bg-white hover:bg-primary-990"}
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-x-2 w-full p-5 cursor-pointer"
                  >
                    <FileCheck2 /> Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center space-x-1 cursor-pointer">
              <Globe />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <ShoppingCart className="w-6 h-6  cursor-pointer" />
            <Heart className="w-6 h-6  cursor-pointer" />
          </div>
        </div>
      </div>

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
              <button
                onClick={closeDrawer}
                className="flex items-center text-lg hover:text-primary-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Cart
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
