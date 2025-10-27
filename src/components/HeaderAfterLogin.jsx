import { useState, useRef, useEffect } from "react";
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
  Bell,
} from "lucide-react";
import { Link, Links, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAllAddresses, useLikedRestaurants, useLikedFoodTrucks, useUnreadNotifications } from "../hooks/api";
import LayoutWrapper from "./layoutWrapper";
import { NotificationMenu, DesktopNotificationMenu } from "./NotificationMenu";
import { processImageUrl } from "@/lib/utils";
import { setupNotificationListener } from "../firebase/notificationListener";
export default function HeaderAfterLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [firebaseNotificationCount, setFirebaseNotificationCount] = useState(0);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const bellRef = useRef(null);
  const mobileBellRef = useRef(null);

  const toggleNotificationMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotificationMenu = () => {
    setIsNotificationOpen(false);
  };

  // Reset Firebase notification count when menu is opened
  const handleNotificationMenuOpen = () => {
    setFirebaseNotificationCount(0);
    setIsNotificationOpen(true);
  };

  // Fetch all addresses using the /address endpoint
  const { data: addresses, isLoading: addressesLoading } = useAllAddresses();
  
  // Fetch liked restaurants and food trucks for favorites count
  const { data: likedRestaurantsData } = useLikedRestaurants();
  const { data: likedFoodTrucksData } = useLikedFoodTrucks();
  
  // Fetch unread notifications count
  const { data: unreadNotificationsResponse } = useUnreadNotifications();
  
  // Calculate unread count from the API response
  const unreadCount = unreadNotificationsResponse?.data?.length || 0;
  
  // Total notification count (API + Firebase)
  const totalNotificationCount = unreadCount + firebaseNotificationCount;
  
  // Debug logging
  console.log('Notification counts:', {
    unreadCount,
    firebaseNotificationCount,
    totalNotificationCount
  });

  // Setup Firebase notification listener
  useEffect(() => {
    const handleFirebaseNotification = (payload) => {
      console.log("Firebase notification received:", payload);
      setFirebaseNotificationCount(prev => prev + 1);
      
      // Show alert when Firebase notification comes
      if (payload.notification) {
        alert(`New Notification: ${payload.notification.title}\n${payload.notification.body}`);
      }
    };

    // Setup Firebase notification listener
    setupNotificationListener(handleFirebaseNotification);
  }, []);

  // Get the first address (index 0) - addresses come directly in response, not nested under data
  const firstAddress =
    addresses?.data.filter((address) => address.default === true)[0] || null;

  // Get total favorites count (restaurants + food trucks)
  const restaurantsCount = likedRestaurantsData?.data?.length || 0;
  const foodTrucksCount = likedFoodTrucksData?.data?.length || 0;
  const favoritesCount = restaurantsCount + foodTrucksCount;

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
      <LayoutWrapper> 
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Mobile: Menu + Logo */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Logo */}
          <Link to="/" onClick={closeDrawer}>
            <img src={processImageUrl("/images/footer-logo.png")} alt="Logo" className="h-10" />
          </Link>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div 
              ref={mobileBellRef}
              className="relative cursor-pointer"
              onClick={handleNotificationMenuOpen}
            >
              <Bell className="w-6 h-6 text-primary-950" />
              {totalNotificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalNotificationCount > 99 ? '99+' : totalNotificationCount}
                </span>
              )}
            </div>
            
            {/* Menu Button */}
            <button
              onClick={toggleDrawer}
              aria-label="Toggle Menu"
              className="text-primary-950"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={processImageUrl("/images/footer-logo.png")} alt="Logo" className="h-10" />
          </Link>
          <div className="flex items-center gap-x-1">
            <MapPin className="text-primary-950" />
            <p className="text-primary-950 max-w-xl truncate">
              Your address:{" "}
              {addressesLoading
                ? <span className="text-gray-400">Loading address...</span>
                : firstAddress
                ? `${firstAddress.address}` || ""
                : window.user?.address || "No address set"}
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
                    to={"/account-settings"}
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

                <DropdownMenuItem
                  className={"p-0 bg-white hover:bg-primary-990"}
                >
                  <Link
                    to={"/favourites"}
                    className="flex items-center gap-x-2 w-full p-5"
                  >
                    <Heart /> My Favourites
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
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/order-confirmation")}
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </div>
            <div className="relative cursor-pointer">
              <Link to={"/favourites"}>
                <Heart className="w-6 h-6" />
              </Link>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>
            <div 
              ref={bellRef}
              className="relative cursor-pointer"
              onClick={handleNotificationMenuOpen}
            >
              <Bell className="w-6 h-6" />
              {totalNotificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalNotificationCount > 99 ? '99+' : totalNotificationCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      </LayoutWrapper>

      {/* Notification Menus */}
      <NotificationMenu 
        isOpen={isNotificationOpen} 
        onClose={closeNotificationMenu}
        triggerRef={mobileBellRef}
        firebaseNotificationCount={firebaseNotificationCount}
      />
      <DesktopNotificationMenu 
        isOpen={isNotificationOpen} 
        onClose={closeNotificationMenu}
        triggerRef={bellRef}
        firebaseNotificationCount={firebaseNotificationCount}
      />

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
              {/* Profile Section */}
              <div className="pb-4 border-b border-gray-600">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-6 h-6" />
                  <span className="text-lg font-medium">{window.user?.name}</span>
                </div>
              </div>

              {/* Profile Menu Items */}
              <Link
                to=""
                onClick={closeDrawer}
                className="flex items-center space-x-3 text-lg hover:text-primary-50"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/account-settings"
                onClick={closeDrawer}
                className="flex items-center space-x-3 text-lg hover:text-primary-50"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <Link
                to="/favourites"
                onClick={closeDrawer}
                className="flex items-center space-x-3 text-lg hover:text-primary-50"
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </div>
                <span>My Favourites</span>
              </Link>

              <Link
                to=""
                onClick={closeDrawer}
                className="flex items-center space-x-3 text-lg hover:text-primary-50"
              >
                <Megaphone className="w-5 h-5" />
                <span>Advertise yourself</span>
              </Link>

              <div className="pt-4 border-t border-gray-600">
                {/* Language Selector */}
                <button
                  onClick={closeDrawer}
                  className="flex items-center space-x-3 text-lg hover:text-primary-50 w-full"
                >
                  <Globe className="w-5 h-5" />
                  <span>EN</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>

                {/* Cart */}
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/order-confirmation");
                  }}
                  className="flex items-center text-lg hover:text-primary-50 w-full mt-4"
                >
                  <div className="relative mr-3">
                    <ShoppingCart className="w-5 h-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-50 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    closeDrawer();
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 text-lg hover:text-primary-50 w-full mt-4"
                >
                  <FileCheck2 className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
