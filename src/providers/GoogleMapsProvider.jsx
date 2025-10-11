// src/GoogleMapsProvider.jsx
import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_LIBRARIES = ["places"];

export default function GoogleMapsProvider({ children }) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key not found.");
    return children;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_LIBRARIES}>
      {children}
    </LoadScript>
  );
}
