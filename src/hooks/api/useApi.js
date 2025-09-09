import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Base API configuration
const API_BASE_URL = 'https://myfoodport.com/api';

// Default headers configuration - single place to manage all headers
const getDefaultHeaders = (method = 'GET') => {
  const headers = {
    Accept: 'application/json',
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

const httpClient = async (url, options = {}) => {
  const method = options.method || "GET";

  const config = {
    method,
    headers: {
      ...getDefaultHeaders(method),
      ...options.headers,
    },
    redirect: "manual",
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json().catch(() => ({}));
    if (
      response.type === "opaqueredirect" ||
      (response.status >= 300 && response.status < 400)
    ) {
      const error = {
        status: response.status,
        message: "Redirect detected. Please check your API endpoint configuration.",
        errors: {},
      };
      throw error;
    }

    if (!response.ok) {
      const error = {
        status: response.status,
        message: data.message || "An error occurred",
        errors: data.errors || {},
      };
      throw error;
    }

    return data;
  } catch (error) {
    
    // Ensure the error has the correct structure
    if (error.status) {
      throw error;
    } else {
      throw {
        status: 0,
        message: "Network error. Please check your connection.",
        errors: {},
      };
    }
  }
};

// GET Hook - useApiQuery
export const useApiQuery = (queryKey, endpoint, params = {}, options = {}) => {
  const buildUrl = (endpoint, params) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.append(key, value);
        }
      }
    });

    return url.toString().replace(API_BASE_URL, '');
  };

  const stableQueryKey = Array.isArray(queryKey)
    ? [...queryKey, JSON.stringify(params)]
    : [queryKey, JSON.stringify(params)];

  return useQuery({
    queryKey: stableQueryKey,
    queryFn: () => httpClient(buildUrl(endpoint, params), { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    structuralSharing: true,
    onError: (error) => handleApiError(error),
    ...options,
  });
};

export const handleApiError = (error) => {
  // Check if we have field-specific errors
  if (error?.errors && typeof error.errors === "object") {
    // Show all field errors
    let hasFieldErrors = false;
    
    Object.values(error.errors).forEach((messages) => {
      if (Array.isArray(messages) && messages.length > 0) {
        hasFieldErrors = true;
        messages.forEach(message => {
          console.log("Showing toast for message:", message);
          toast.error(message);
        });
      }
    });
    
    if (hasFieldErrors) return; // Exit after showing field errors
  }
  
  // If no field errors, check for a general message
  if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred");
  }
};

// POST Hook - useApiMutation
export const useApiMutation = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: (data) =>
      httpClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables, context) => {
      if (data.message) {
        toast.success(data.message);
      }

      if (invalidateQueries) {
        const queries = Array.isArray(invalidateQueries)
          ? invalidateQueries
          : [invalidateQueries];

        queries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...otherOptions,
  });
};

// PUT/PATCH Hook - useApiUpdateMutation
export const useApiUpdateMutation = (endpoint, method = 'PUT', options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: (data) =>
      httpClient(endpoint, {
        method: method.toUpperCase(),
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables, context) => {
      if (data.message) {
        toast.success(data.message);
      }

      if (invalidateQueries) {
        const queries = Array.isArray(invalidateQueries)
          ? invalidateQueries
          : [invalidateQueries];

        queries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...otherOptions,
  });
};

// DELETE Hook - useApiDeleteMutation
export const useApiDeleteMutation = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: (id) => {
      const deleteEndpoint = id ? `${endpoint}/${id}` : endpoint;
      return httpClient(deleteEndpoint, {
        method: 'DELETE',
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.message) {
        toast.success(data.message);
      } else {
        toast.success('Deleted successfully');
      }

      if (invalidateQueries) {
        const queries = Array.isArray(invalidateQueries)
          ? invalidateQueries
          : [invalidateQueries];

        queries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...otherOptions,
  });
};

export const useApiForm = (mutation, form) => {
  const handleSubmit = form.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: (...args) => {
        form.reset();
        if (mutation.options.onSuccess) {
          mutation.options.onSuccess(...args);
        }
      },
      onError: (error, ...args) => {
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
        if (mutation.options.onError) {
          mutation.options.onError(error, ...args);
        }
      }
    });
  });

  return {
    handleSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};