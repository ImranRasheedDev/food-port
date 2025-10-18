import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient, handleApiError } from './useApi';
import { toast } from 'react-toastify';

// Custom hook for updating address with ID in URL
export const useUpdateAddress = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ address_id, ...data }) => {
      return httpClient(`/address/update/${address_id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.message) toast.success(data.message);
      
      // Invalidate queries to refetch addresses everywhere
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address'] });
      
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Custom hook for deleting address with ID in URL
export const useDeleteAddress = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (address_id) => {
      return httpClient(`/address/delete/${address_id}`, {
        method: 'POST',
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.message) toast.success(data.message || 'Address deleted successfully');
      
      // Invalidate queries to refetch addresses everywhere
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address'] });
      
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Custom hook for setting default address with ID in URL
export const useSetDefaultAddress = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ address_id }) => {
      return httpClient(`/address/default/${address_id}`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.message) toast.success(data.message || 'Default address set successfully');
      
      // Invalidate queries to refetch addresses everywhere
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address'] });
      
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      options.onError?.(error, variables, context);
    },
    ...options,
  });
};
