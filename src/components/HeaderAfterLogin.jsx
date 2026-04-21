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
import { useLikedRestaurants, useLikedFoodTrucks, useUnreadNotifications } from "../hooks/api";
import LayoutWrapper from "./layoutWrapper";
import { NotificationMenu, DesktopNotificationMenu } from "./NotificationMenu";
import { processImageUrl } from "@/lib/utils";
import { setupNotificationListener } from "../firebase/notificationListener";
export default function HeaderAfterLogin() {
  // Updated to use window.user instead of API calls
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [firebaseNotificationCount, setFirebaseNotificationCount] = useState(0);
  const [userName, setUserName] = useState(window.user?.name || "");
  // Check multiple possible address fields
  const getInitialAddress = () => {
    return window.user?.address || window.user?.user_address || window.user?.location || "";
  };
  const [userAddress, setUserAddress] = useState(getInitialAddress());

  console.log("userAddress", window.user);

  // Initialize user image with proper URL handling
  const getInitialImage = () => {
    const imageValue = window.user?.image || window.user?.avatar || "";
    if (!imageValue || imageValue === null) return "";
    if (imageValue.startsWith('http') || imageValue.startsWith('/')) {
      return imageValue;
    }
    // Relative path from API - construct full URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${imageValue}` : imageValue;
  };

  const [userImage, setUserImage] = useState(getInitialImage());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);
  const navigate = useNavigate();
  const { getCartItemCount, items, restaurantData, openCartDrawer } = useCart();
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

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = (event) => {
      console.log("=== HeaderAfterLogin: Received userUpdated event ===");
      console.log("HeaderAfterLogin: Event:", event);
      const updatedUser = event.detail;
      console.log("HeaderAfterLogin: Updated user data:", updatedUser);
      console.log("HeaderAfterLogin: updatedUser.name:", updatedUser.name);
      console.log("HeaderAfterLogin: updatedUser.address:", updatedUser.address);
      console.log("HeaderAfterLogin: updatedUser.user_address:", updatedUser.user_address);
      console.log("HeaderAfterLogin: updatedUser.location:", updatedUser.location);
      console.log("HeaderAfterLogin: updatedUser.image:", updatedUser.image);

      // Update name
      const newName = updatedUser.name || "";
      console.log("HeaderAfterLogin: Updating userName from:", userName, "to:", newName);
      setUserName(newName);

      // Update address from multiple possible fields
      const newAddress = updatedUser.address || updatedUser.user_address || updatedUser.location || "";
      console.log("HeaderAfterLogin: Updating address from:", userAddress, "to:", newAddress);
      setUserAddress(newAddress);

      // Handle image URL - could be relative path or full URL
      let imageValue = updatedUser.image || updatedUser.avatar || "";
      console.log("HeaderAfterLogin: Raw image value:", imageValue);

      if (imageValue && imageValue !== null && imageValue.trim() !== "") {
        // Clean escaped slashes
        imageValue = imageValue.replace(/\\\//g, '/');
        console.log("HeaderAfterLogin: Cleaned image value:", imageValue);

        if (!imageValue.startsWith('http') && !imageValue.startsWith('/')) {
          // Relative path from API - construct full URL
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
          imageValue = apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${imageValue}` : imageValue;
          console.log("HeaderAfterLogin: Constructed image URL:", imageValue);
        }
      }

      console.log("HeaderAfterLogin: Updating userImage from:", userImage, "to:", imageValue || "");
      setUserImage(imageValue || "");

      // Also update window.user to ensure consistency
      window.user = updatedUser;

      console.log("HeaderAfterLogin: State update complete");
      console.log("HeaderAfterLogin: New userName:", newName);
      console.log("HeaderAfterLogin: New userAddress:", newAddress);
      console.log("HeaderAfterLogin: New userImage:", imageValue || "");
      console.log("=== End HeaderAfterLogin userUpdated event ===");
    };

    console.log("HeaderAfterLogin: Setting up userUpdated event listener");
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      console.log("HeaderAfterLogin: Cleaning up userUpdated event listener");
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []); // Empty dependency array to prevent re-registering listener

  // Log user data on mount for debugging
  useEffect(() => {
    console.log("=== HeaderAfterLogin Debug ===");
    console.log("window.user:", window.user);
    console.log("window.user.address:", window.user?.address);
    console.log("window.user.user_address:", window.user?.user_address);
    console.log("window.user.location:", window.user?.location);
    console.log("window.user.addresses:", window.user?.addresses);
    console.log("Current userAddress state:", userAddress);
    console.log("=============================");
  }, [userAddress]);

  // Also log when userAddress state changes
  useEffect(() => {
    console.log("HeaderAfterLogin: userAddress state changed to:", userAddress);
    console.log("HeaderAfterLogin: Current window.user.address:", window.user?.address);
  }, [userAddress]);


  // Get total favorites count (restaurants + food trucks)
  const restaurantsCount = likedRestaurantsData?.data?.length || 0;
  const foodTrucksCount = likedFoodTrucksData?.data?.length || 0;
  const favoritesCount = restaurantsCount + foodTrucksCount;

  const handleCartClick = () => {
    openCartDrawer();
  };

  const handleLogout = () => {
    window.helper.sweetAlert(
      "warning",
      "Are you sure?",
      "You want to logout?",
      async (result) => {
        if (result.isConfirmed) {
          await window.helper.removeStorageData();
          window.user = "";
          navigate("/auth/login");
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
            {/* <div className="flex items-center gap-x-1">
              <MapPin className="text-primary-950" />
              <p className="text-primary-950 max-w-xl truncate">
                Your address:{" "}
                {userAddress || "No address set"}
              </p>
            </div> */}
            {/* Right side buttons */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
              >
                Home
              </Link>
              <Link
                to="/about-us"
              >
                About us
              </Link>
              <Link
                to="/contact-us"
              >
                Contact us
              </Link>
              <Link
                to="/advertisement"
              >
                Advertisement
              </Link>
              <Link
                to="/become-a-partner"
              >
                Become a Partner
              </Link>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer border-0 outline-none">
                  {userImage && userImage.trim() !== "" ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        console.log('Avatar image failed to load:', userImage);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = processImageUrl("/images/avatar.jpg");
                      }}
                    />
                  ) : (
                    <img
                      src={processImageUrl("/images/avatar.jpg")}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{userName}</span>
                  <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-3xs shadow-lg p-0"}>
                  {/* <DropdownMenuItem
                    onClick={() => setDropdownOpen(false)}
                    className={"p-0 bg-white hover:bg-primary-990"}
                  >
                    <Link
                      to={""}

                      className="flex items-center gap-x-2 w-full p-5"
                    >
                      <LayoutDashboard /> Dashboard
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    className={"p-0 bg-white hover:bg-primary-990"}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link
                      to={"/account-settings"}
                      className="flex items-center gap-x-2 w-full p-5"
                    >
                      <User /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    className={"p-0 bg-white hover:bg-primary-990"}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link
                      to={""}
                      className="flex items-center gap-x-2 w-full p-5"
                    >
                      <Megaphone /> Advertise yourself
                    </Link>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem
                    className={"p-0 bg-white hover:bg-primary-990"}
                    onClick={() => setDropdownOpen(false)}
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
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <button
                      className="flex items-center gap-x-2 w-full p-5 cursor-pointer"
                    >
                      <FileCheck2 /> Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <div className="flex items-center space-x-1 cursor-pointer">
              <Globe />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </div> */}
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
                className="relative cursor-pointer"
                onClick={handleCartClick}
              >
                {/* <ShoppingCart className="w-6 h-6" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="none"
                  viewBox="0 0 26 26"
                >
                  <path
                    fill="#39434D"
                    fillRule="evenodd"
                    d="M13.002 2.167c2.752 0 4.79 1.788 4.931 4.505h3.57a1.083 1.083 0 0 1 1.073 1.236l-1.857 12.828c-.077.534-.534.93-1.073.93H6.36c-.54 0-.997-.396-1.073-.93L3.43 7.909a1.083 1.083 0 0 1 1.072-1.236l3.474.006c.14-2.717 2.276-4.511 5.027-4.511m6.022 15.437H6.98a.433.433 0 0 0-.429.495l.225 1.57c.03.214.214.373.43.373H18.8a.43.43 0 0 0 .428-.372l.225-1.571a.433.433 0 0 0-.429-.495m1.354-9.307H5.625a.433.433 0 0 0-.433.433c0 .286.001.041.004.061l.998 6.816c.031.214.214.372.43.372H19.38a.43.43 0 0 0 .429-.372l.999-6.816a.433.433 0 0 0-.43-.494m-7.376-4.61c-1.718 0-3.084.996-3.347 2.598a.334.334 0 0 0 .325.393l5.96-.006a.32.32 0 0 0 .32-.322c0-.02-.05-.043-.005-.059-.379-1.608-1.53-2.604-3.253-2.604"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {getCartItemCount() > 0 && (
                  <span className="absolute top-1/2 -translate-y-1/2 -right-3 text-primary-950 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
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
                  {userImage && userImage.trim() !== "" ? (
                    <img
                      src={processImageUrl(userImage, "/images/avatar.jpg")}
                      alt={userName}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        console.log('Mobile avatar image failed to load:', userImage);
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = processImageUrl("/images/avatar.jpg");
                      }}
                    />
                  ) : (
                    <img
                      src={processImageUrl("/images/avatar.jpg")}
                      alt={userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <span className="text-lg font-medium">{userName}</span>
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

              {/* <Link
                to=""
                onClick={closeDrawer}
                className="flex items-center space-x-3 text-lg hover:text-primary-50"
              >
                <Megaphone className="w-5 h-5" />
                <span>Advertise yourself</span>
              </Link> */}

              <div className="pt-4 border-t border-gray-600">
                {/* Language Selector */}
                {/* <button
                  onClick={closeDrawer}
                  className="flex items-center space-x-3 text-lg hover:text-primary-50 w-full"
                >
                  <Globe className="w-5 h-5" />
                  <span>EN</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button> */}

                {/* Cart */}
                <button
                  onClick={handleCartClick}
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