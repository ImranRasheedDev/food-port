import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Default headers configuration
const getDefaultHeaders = async (method = 'GET') => {
  const headers = {
    Accept: 'application/json',
  };

  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    headers['Content-Type'] = 'application/json';
  }

  const token = window.user?.access_token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Centralized HTTP client
const httpClient = async (url, options = {}) => {
  const method = options.method || 'GET';
  const defaultHeaders = await getDefaultHeaders(method);

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    redirect: 'manual',
    ...options,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, config);
    const data = await response.json().catch(() => ({}));

    if (
      response.type === 'opaqueredirect' ||
      (response.status >= 300 && response.status < 400)
    ) {
      throw {
        status: response.status,
        message: 'Redirect detected. Please check your API endpoint configuration.',
        errors: {},
      };
    }

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

// 🔹 Fixed: use window.constants.api_base_url instead of undefined API_BASE_URL
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, window.location.origin); // temp absolute for searchParams

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  return endpoint + url.search; // only relative path
};

// ----------------------
// GET Hook
// ----------------------
export const useApiQuery = (queryKey, endpoint, params = {}, options = {}) => {
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

// ----------------------
// Error Handler
// ----------------------
export const handleApiError = (error) => {
  if (error?.errors && typeof error.errors === 'object') {
    let hasFieldErrors = false;

    Object.values(error.errors).forEach((messages) => {
      if (Array.isArray(messages) && messages.length > 0) {
        hasFieldErrors = true;
        messages.forEach((message) => toast.error(message));
      }
    });

    if (hasFieldErrors) return;
  }

  if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
};

// ----------------------
// POST Hook
// ----------------------
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
      if (data.message) toast.success(data.message);

      if (invalidateQueries) {
        (Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries]).forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      onError?.(error, variables, context);
    },
    ...otherOptions,
  });
};

// ----------------------
// PUT / PATCH Hook
// ----------------------
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
      if (data.message) toast.success(data.message);

      if (invalidateQueries) {
        (Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries]).forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      onError?.(error, variables, context);
    },
    ...otherOptions,
  });
};

// ----------------------
// DELETE Hook
// ----------------------
export const useApiDeleteMutation = (endpoint, options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: (id) => {
      const deleteEndpoint = id ? `${endpoint}/${id}` : endpoint;
      return httpClient(deleteEndpoint, { method: 'DELETE' });
    },
    onSuccess: (data, variables, context) => {
      toast.success(data.message || 'Deleted successfully');

      if (invalidateQueries) {
        (Array.isArray(invalidateQueries) ? invalidateQueries : [invalidateQueries]).forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      onError?.(error, variables, context);
    },
    ...otherOptions,
  });
};

// ----------------------
// Form Helper
// ----------------------
export const useApiForm = (mutation, form) => {
  const handleSubmit = form.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: (...args) => {
        form.reset();
        mutation.options?.onSuccess?.(...args);
      },
      onError: (error, ...args) => {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              form.setError(field, { type: 'server', message: messages[0] });
            }
          });
        }
        mutation.options?.onError?.(error, ...args);
      },
    });
  });

  return {
    handleSubmit,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
