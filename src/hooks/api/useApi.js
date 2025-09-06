import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// HTTP client with error handling
const httpClient = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || 'An error occurred',
      errors: errorData.errors || {},
    };
  }

  return response.json();
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

  return useQuery({
    queryKey: Array.isArray(queryKey) ? [...queryKey, params] : [queryKey, params],
    queryFn: () => httpClient(buildUrl(endpoint, params)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
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