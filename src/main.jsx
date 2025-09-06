import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import QueryProvider from "./providers/QueryProvider";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryProvider>
      <App />
      <ToastContainer position="top-right" />
    </QueryProvider>
  </BrowserRouter>
);
