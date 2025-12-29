import { Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider, useCart } from "./contexts/CartContext";
import { LoaderProvider, useLoader } from "./contexts/LoaderContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./components/ui/sheet";
import DynamicCart from "./components/Cards/DynamicCart";
import { PageLoader } from "./components/ui/loader";
import RouteLoader from "./components/RouteLoader";

// Import your new auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OTP from "./pages/auth/OTP";
import ResetPassword from "./pages/auth/ResetPassword";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AllResturants from "./pages/AllResturants";
import AccountSettings from "./pages/AccountSettings";
import SetLocation from "./pages/SetLocation";
import Favourites from "./pages/Favourites";
import ResturantsDetail from "./pages/ResturantsDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import AddCard from "./pages/AddCard";
import OrderWaiting from "./pages/OrderWaiting";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import LayoutNotFound from "./pages/LayoutNotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import ContactUs from "./pages/ContactUs";
import Pay from "./pages/Pay";
import Cart from "./pages/Cart";
import About from "./pages/About";

// Global Cart Drawer Component
function GlobalCartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer } = useCart();

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={closeCartDrawer}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        <DynamicCart />
      </SheetContent>
    </Sheet>
  );
}

// Global Loader Component
function GlobalLoader() {
  const { isLoading, loadingMessage } = useLoader();

  if (!isLoading) return null;

  return <PageLoader message={loadingMessage} />;
}

function App() {
  return (
    <LoaderProvider>
      <CartProvider>
        {/* Route transition loader */}
        <RouteLoader />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about-us" element={<About />} />
            <Route path="all-resturants" element={<AllResturants />} />
            <Route
              path="resturants-detail/:restaurant_id"
              element={<ResturantsDetail />}
            />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="set-location" element={<SetLocation />} />
            <Route path="favourites" element={<Favourites />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmation />}
            />
            <Route path="add-card" element={<AddCard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="pay" element={<Pay />} />
            <Route path="order-waiting" element={<OrderWaiting />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact-us" element={<ContactUs />} />

            {/* 404 Route for Layout routes */}
            <Route path="*" element={<LayoutNotFound />} />
          </Route>

          {/* Auth routes that do not have a layout */}
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="otp" element={<OTP />} />
            {/* <Route path="otp" element={<OTP />} /> */}
            <Route path="reset-password" element={<ResetPassword />} />
            {/* <Route path="reset-password" element={<ResetPassword />} /> */}
          </Route>

          {/* 404 Route - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg"
          limit={3}
          transition={Bounce}
        />

        {/* Global Cart Drawer */}
        <GlobalCartDrawer />

        {/* Global Loader */}
        <GlobalLoader />
      </CartProvider>
    </LoaderProvider>
  );
}

export default App;
