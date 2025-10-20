import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { isValidUrl } from "./inValidUrl";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to process API image URLs
export function processImageUrl(imageUrl, fallback = "/images/placeholder.jpg") {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallback;
  }

  // Trim whitespace
  imageUrl = imageUrl.trim();

  // If it's already a valid absolute URL, return as is
  if (isValidUrl(imageUrl) && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }

  // If it's a relative path starting with /images/ (static images), return as is
  if (imageUrl.startsWith('/images/') || imageUrl.startsWith('/assets/')) {
    return imageUrl;
  }

  // If it's a relative path starting with /, return as is (for other static assets)
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it's a relative path that needs the API base URL, construct it
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiBaseUrl && !imageUrl.startsWith('http')) {
    try {
      // Remove trailing slash from API base URL and leading slash from image URL if present
      const cleanApiUrl = apiBaseUrl.replace(/\/$/, '');
      const cleanImageUrl = imageUrl.replace(/^\//, '');
      const fullUrl = `${cleanApiUrl}/${cleanImageUrl}`;
      
      // Validate the constructed URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Failed to construct API image URL:', error);
      return fallback;
    }
  }

  // Fallback to the provided fallback image
  console.warn('Image URL processing failed for:', imageUrl);
  return fallback;
}
