import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { isValidUrl } from "./inValidUrl";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to process API image URLs
export function processImageUrl(imageUrl, fallback = "/images/placeholder.jpg") {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return fallback;
  }

  // If it's already a valid absolute URL, return as is
  if (isValidUrl(imageUrl) && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }

  // If it's a relative path starting with /, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it's a relative path that needs the API base URL, construct it
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiBaseUrl && !imageUrl.startsWith('http')) {
    // Remove trailing slash from API base URL and leading slash from image URL if present
    const cleanApiUrl = apiBaseUrl.replace(/\/$/, '');
    const cleanImageUrl = imageUrl.replace(/^\//, '');
    return `${cleanApiUrl}/${cleanImageUrl}`;
  }

  // Fallback to the provided fallback image
  return fallback;
}
