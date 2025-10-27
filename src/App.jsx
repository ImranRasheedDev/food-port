import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./contexts/CartContext";

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

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
          <Route path="order-waiting" element={<OrderWaiting />} />
          <Route path="notifications" element={<Notifications />} />
          
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
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg"
      />
    </CartProvider>
  );
}

export default App;
