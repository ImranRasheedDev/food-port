import { useApiQuery, useApiMutation, httpClient } from './useApi';
import { useQuery, useMutation } from '@tanstack/react-query';

// Public HTTP client for banner ads (no authentication required)
const publicHttpClient = async (url, options = {}) => {
  const method = options.method || 'GET';
  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    redirect: 'manual',
    ...options,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors || {},
      };
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    throw {
      status: 0,
      message: 'Network error. Please check your connection.',
      errors: {},
    };
  }
};

// Helper function to build URL with params
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  return endpoint + url.search;
};

// Hook to fetch banner ads (public API, no authentication required)
export const useBannerAds = (options = {}) => {
  return useQuery({
    queryKey: ['banner-ads', { banner: 1 }],
    queryFn: () => publicHttpClient(buildUrl('/ad_campaign', { banner: 1 }), { method: 'GET' }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    ...options,
  });
};

// Hook to track ad clicks - creates a custom mutation for each campaign (requires auth token)
export const useAdClickMutation = (campaignId, options = {}) => {
  return useMutation({
    mutationFn: () => httpClient(`/ad_campaign/click/${campaignId}`, { 
      method: 'POST',
      body: JSON.stringify({})
    }),
    disableToast: true, // Don't show toast for click tracking
    ...options,
  });
};

// Helper function to track ad click (requires authentication token)
export const trackAdClick = (mutation, campaignId) => {
  if (campaignId && mutation.mutate) {
    // Track click silently - don't show errors to user
    mutation.mutate({}, {
      onError: (error) => {
        // Silently log error for debugging but don't show to user
        console.warn('Ad click tracking failed:', error);
      }
    });
  }
};
