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
import InitialLoader from "@/components/InitialLoader";


if ("serviceWorker" in navigator) {
  const basePath = import.meta.env.VITE_BASE_URL || '/';
  const swPath = `${basePath}firebase-messaging-sw.js`;
  
  navigator.serviceWorker
    .register(swPath)
    .then((registration) => {
      console.log("Service Worker registered:", registration);
    })
    .catch((err) => console.error("Service Worker registration failed:", err));
}


const init = async () => {
  // Show initial loader immediately
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<InitialLoader />);
  
  // Run bootstrap process
  await bootstrap();
  
  // Get the base path from environment or detect it
  const basePath = import.meta.env.VITE_BASE_URL || '/';
  
  // Render the main app after bootstrap completes
  root.render(
    <BrowserRouter basename={basePath}>
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
