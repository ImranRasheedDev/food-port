import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { isValidUrl } from "./inValidUrl";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Helper function to get the base URL for static assets
export function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';
  // Ensure baseUrl doesn't end with slash (except for root)
  return baseUrl === '/' ? baseUrl : baseUrl.replace(/\/$/, '');
}

// Helper function to get full path for static images
export function getStaticImagePath(imagePath) {
  const baseUrl = getBaseUrl();
  
  // Handle edge cases
  if (!imagePath) {
    return baseUrl === '/' ? '/images/placeholder.jpg' : `${baseUrl}/images/placeholder.jpg`;
  }
  
  // Clean the image path - remove leading slash
  const cleanImagePath = imagePath.replace(/^\//, '');
  
  // Return the full path
  return baseUrl === '/' ? `/${cleanImagePath}` : `${baseUrl}/${cleanImagePath}`;
}

// Utility function to process API image URLs and static assets
export function processImageUrl(imageUrl, fallback = "/images/placeholder.jpg") {
  // Get environment variables
  const baseUrl = getBaseUrl();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Handle empty or invalid imageUrl
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return getStaticImagePath(fallback);
  }

  // Trim whitespace
  imageUrl = imageUrl.trim();

  // If it's already a complete absolute URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      // Invalid URL, fall back to static path
      return getStaticImagePath(fallback);
    }
  }

  // Handle static assets (starting with /images/, /assets/, or any other absolute path)
  if (imageUrl.startsWith('/')) {
    // This is a static asset path
    return getStaticImagePath(imageUrl);
  }

  // Handle relative paths that need API base URL (dynamic images from API)
  if (apiBaseUrl && !imageUrl.startsWith('http')) {
    try {
      // Clean up URLs
      const cleanApiUrl = apiBaseUrl.replace(/\/$/, '');
      const cleanImageUrl = imageUrl.replace(/^\//, '');
      const fullUrl = `${cleanApiUrl}/${cleanImageUrl}`;
      
      // Debug logging for production
      console.log('Image URL Debug:', {
        originalImageUrl: imageUrl,
        apiBaseUrl: apiBaseUrl,
        cleanApiUrl: cleanApiUrl,
        cleanImageUrl: cleanImageUrl,
        fullUrl: fullUrl
      });
      
      // Validate the constructed URL
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      console.warn('Failed to construct API image URL:', error);
      return getStaticImagePath(fallback);
    }
  }

  // For any other case (relative paths without API base), treat as static
  return getStaticImagePath(fallback);
}
