import { 
  useApiQuery, 
  useApiMutation, 
  useApiUpdateMutation, 
  useApiDeleteMutation 
} from './useApi';

// Generic resource hook factory
export const createResourceHooks = (resourceName, endpoint) => {
  const queryKey = [resourceName];
  
  return {
    // Get all resources
    [`use${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`]: (params = {}) => {
      return useApiQuery(
        queryKey,
        endpoint,
        params,
        {
          keepPreviousData: true,
        }
      );
    },

    // Get single resource
    [`use${resourceName.charAt(0).toUpperCase() + resourceName.slice(1).slice(0, -1)}`]: (id, options = {}) => {
      return useApiQuery(
        [...queryKey, id],
        `${endpoint}/${id}`,
        {},
        {
          enabled: !!id,
          ...options,
        }
      );
    },

    // Create resource
    [`useCreate${resourceName.charAt(0).toUpperCase() + resourceName.slice(1).slice(0, -1)}`]: (options = {}) => {
      return useApiMutation(endpoint, {
        invalidateQueries: queryKey,
        ...options,
      });
    },

    // Update resource
    [`useUpdate${resourceName.charAt(0).toUpperCase() + resourceName.slice(1).slice(0, -1)}`]: (id, options = {}) => {
      return useApiUpdateMutation(`${endpoint}/${id}`, 'PUT', {
        invalidateQueries: [queryKey, [...queryKey, id]],
        ...options,
      });
    },

    // Delete resource
    [`useDelete${resourceName.charAt(0).toUpperCase() + resourceName.slice(1).slice(0, -1)}`]: (options = {}) => {
      return useApiDeleteMutation(endpoint, {
        invalidateQueries: queryKey,
        ...options,
      });
    },
  };
};

// Example usage - you can create hooks for any resource
export const {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} = createResourceHooks('products', '/products');

export const {
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} = createResourceHooks('orders', '/orders');

export const {
  useCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} = createResourceHooks('categories', '/categories');