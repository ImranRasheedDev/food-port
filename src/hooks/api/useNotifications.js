import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  useApiQuery, 
  useApiMutation, 
  useApiUpdateMutation, 
  useApiDeleteMutation,
  httpClient,
  handleApiError
} from './useApi';
import { toast } from 'react-toastify';

// Get all notifications
export const useNotifications = (options = {}) => {
  return useApiQuery(
    ['notifications'],
    '/notifications',
    {},
    {
      refetchOnWindowFocus: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      ...options,
    }
  );
};

// Get unread notifications
export const useUnreadNotifications = (options = {}) => {
  return useApiQuery(
    ['notifications', 'unread'],
    '/notifications/unread',
    {},
    {
      refetchOnWindowFocus: true,
      staleTime: 1 * 60 * 1000, // 1 minute
      ...options,
    }
  );
};

// Mark notification as read
export const useMarkNotificationRead = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: async (id) => {
      const response = await httpClient(`/notifications/${id}/read`, {
        method: 'POST',
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
      // Default invalidation for all notification queries
      const defaultInvalidation = [
        ['notifications'],
        ['notifications', 'unread'],
        ['notifications', variables] // Invalidate specific notification if it exists
      ];
      
      const queriesToInvalidate = invalidateQueries || defaultInvalidation;
      (Array.isArray(queriesToInvalidate) ? queriesToInvalidate : [queriesToInvalidate]).forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      onError?.(error, variables, context);
    },
    ...otherOptions,
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = (options = {}) => {
  return useApiMutation('/notifications/read-all', {
    invalidateQueries: [
      ['notifications'],
      ['notifications', 'unread']
    ],
    ...options,
  });
};

// Delete notification
export const useDeleteNotification = (options = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, invalidateQueries, ...otherOptions } = options;

  return useMutation({
    mutationFn: async (id) => {
      const response = await httpClient(`/notifications/delete/${id}`, {
        method: 'POST',
      });
      return response;
    },
    onSuccess: (data, variables, context) => {
      if (data.message) toast.success(data.message);
      
      // Default invalidation for all notification queries
      const defaultInvalidation = [
        ['notifications'],
        ['notifications', 'unread'],
        ['notifications', variables] // Invalidate specific notification if it exists
      ];
      
      const queriesToInvalidate = invalidateQueries || defaultInvalidation;
      (Array.isArray(queriesToInvalidate) ? queriesToInvalidate : [queriesToInvalidate]).forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleApiError(error);
      onError?.(error, variables, context);
    },
    ...otherOptions,
  });
};

// Delete all notifications
export const useDeleteAllNotifications = (options = {}) => {
  return useApiMutation('/notifications/delete-all', {
    invalidateQueries: [
      ['notifications'],
      ['notifications', 'unread']
    ],
    ...options,
  });
};

// Get notification by ID
export const useNotification = (id, options = {}) => {
  return useApiQuery(
    ['notifications', id],
    `/notifications/${id}`,
    {},
    {
      enabled: !!id,
      ...options,
    }
  );
};
