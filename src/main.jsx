import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App.jsx";
import "@/index.css";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@/providers/QueryProvider";
import GoogleMapsProvider from "@/providers/GoogleMapsProvider";
import "react-toastify/dist/ReactToastify.css";
import bootstrap from "@/bootstrap";
import { NotificationProvider } from "@/contexts/NotificationContext";


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => console.error("Service Worker registration failed:", err));
}


const init = async () => {
  await bootstrap();
  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <QueryProvider>
        <GoogleMapsProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>

          <ToastContainer position="top-right" />
        </GoogleMapsProvider>
      </QueryProvider>
    </BrowserRouter>
  );
};

init();
