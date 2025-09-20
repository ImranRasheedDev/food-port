import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Import your new auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import OTP from './pages/auth/OTP';
import ResetPassword from './pages/auth/ResetPassword';
import Layout from './components/Layout';
import Home from './pages/Home';
import AllResturants from './pages/AllResturants';
import AccountSettings from './pages/AccountSettings';
import SetLocation from './pages/SetLocation';
import Favourites from './pages/Favourites';
import ResturantsDetail from "./pages/ResturantsDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route index path="/all-resturants" element={<AllResturants />} />
          <Route index path="/resturants-detail" element={<ResturantsDetail />} />
          <Route index path="/account-settings" element={<AccountSettings />} />
          <Route index path="/set-location" element={<SetLocation />} />
          <Route index path="/favourites" element={<Favourites />} />
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
    </>
  );
}

export default App;
