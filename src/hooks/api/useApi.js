import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Base API configuration
const API_BASE_URL = 'https://myfoodport.com/api';

// Default headers configuration - single place to manage all headers
const getDefaultHeaders = (method = 'GET') => {
  const headers = {
    'Accept': 'application/json',
  };

  // Add Content-Type for methods that send data
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// HTTP client with error handling
const httpClient = async (url, options = {}) => {
  const method = options.method || 'GET';
  
  const config = {
    method,
    headers: {
      ...getDefaultHeaders(method),
      ...options.headers,
    },
    // Prevent browser from following redirects automatically
    redirect: 'manual',
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Handle redirects (302, 301, etc.)
    if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
      throw {
        status: response.status,
        message: 'Redirect detected. Please check your API endpoint configuration.',
        errors: {},
      };
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || 'An error occurred',
        errors: errorData.errors || {},
      };
    }

    return response.json();
  } catch (error) {
    // Re-throw our custom errors
    if (error.status) {
      throw error;
    }
    
    // Handle network errors
    throw {
      status: 0,
      message: 'Network error. Please check your connection.',
      errors: {},
    };
  }
};

// GET Hook - useApiQuery
export const useApiQuery = (
  queryKey,
  endpoint,
  params = {},
  options = {}
) => {
  const buildUrl = (endpoint, params) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Handle query parameters, search, filters, pagination
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else {
          url.searchParams.append(key, value);
        }
      }
    });
    
    return url.toString().replace(API_BASE_URL, '');
  };

  // Create a stable query key to prevent unnecessary re-renders
  const stableQueryKey = Array.isArray(queryKey) 
    ? [...queryKey, JSON.stringify(params)] 
    : [queryKey, JSON.stringify(params)];

  return useQuery({
    queryKey: stableQueryKey,
    queryFn: () => httpClient(buildUrl(endpoint, params), { method: 'GET' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnMount: false, // Prevent refetch on mount if data exists
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnReconnect: true, // Only refetch on reconnect
    // Prevent duplicate requests for the same query
    structuralSharing: true,
    ...options,
  });
};

// POST Hook - useApiMutation
export const useApiMutation = (
  endpoint,
  options = {}
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => httpClient(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables, context) => {
      // Show success toast
      if (data.message) {
        toast.success(data.message);
      }
      
      // Invalidate queries if specified
      if (options.invalidateQueries) {
        const queries = Array.isArray(options.invalidateQueries) 
          ? options.invalidateQueries 
          : [options.invalidateQueries];
        
        queries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.log("useApi onError error", error);
      console.log("useApi onError variables", variables);
      console.log("useApi onError context", context);
      // Handle validation errors
      if (error.errors && Object.keys(error.errors).length > 0) {
        // Show first error for each field
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(`${field}: ${messages[0]}`);
          }
        });
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// PUT/PATCH Hook - useApiUpdateMutation
export const useApiUpdateMutation = (
  endpoint,
  method = 'PUT',
  options = {}
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => httpClient(endpoint, {
      method: method.toUpperCase(),
      body: JSON.stringify(data),
    }),
    onSuccess: (data, variables, context) => {
      // Show success toast
      if (data.message) {
        toast.success(data.message);
      }
      
      // Invalidate queries if specified
      if (options.invalidateQueries) {
        const queries = Array.isArray(options.invalidateQueries) 
          ? options.invalidateQueries 
          : [options.invalidateQueries];
        
        queries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Handle validation errors
      if (error.errors && Object.keys(error.errors).length > 0) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(`${field}: ${messages[0]}`);
          }
        });
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// DELETE Hook - useApiDeleteMutation
export const useApiDeleteMutation = (
  endpoint,
  options = {}
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => {
      const deleteEndpoint = id ? `${endpoint}/${id}` : endpoint;
      return httpClient(deleteEndpoint, {
        method: 'DELETE',
      });
    },
    onSuccess: (data, variables, context) => {
      // Show success toast
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success('Deleted successfully');
      }
      
      // Invalidate queries if specified
      if (options.invalidateQueries) {
        const queries = Array.isArray(options.invalidateQueries) 
          ? options.invalidateQueries 
          : [options.invalidateQueries];
        
        queries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete');
      }
      
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

// Utility hook for form integration
export const useApiForm = (mutation, form) => {
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
      form.reset(); // Reset form on success
    } catch (error) {
      // Set form errors if they exist
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            form.setError(field, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      }
    }
  });

  return {
    handleSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};