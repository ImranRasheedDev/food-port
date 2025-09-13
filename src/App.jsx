import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Home from './pages/Home';
// import NotFound from './pages/NotFound';

// Import your new auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OTP from "./pages/auth/OTP";
import ResetPassword from "./pages/auth/ResetPassword";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AllResturants from "./pages/AllResturants";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} /> {/* Your landing page */}
          <Route
            index
            path="/all-resturants"
            element={<AllResturants />}
          />{" "}
          {/* Your landing page */}
        </Route>

        {/* Auth routes that do not have a layout */}
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="otp" element={<OTP />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* A catch-all route for 404 pages, always at the end */}
        {/* <Route path="*" element={<NotFound />} /> */}
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
