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
    [`use${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`]: (params = {}, options = {}) => {
      return useApiQuery(
        options.queryKey || queryKey,
        endpoint,
        params,
        {
          keepPreviousData: false, // Changed to false to allow immediate updates on pagination
          ...options,
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
 
} = createResourceHooks('categories', '/restaurant/category');

export const {
  useRestaurants,
  useRestaurant,
} = createResourceHooks('restaurants', '/restaurant');

// Specialized restaurant detail hook with includes
export const useRestaurantDetail = (restaurantId, options = {}) => {
  return useApiQuery(
    ['restaurants', restaurantId, 'detail'],
    `/restaurant/single/${restaurantId}?includes=productCategories.products,ratings.customer.user`,
    {},
    {
      enabled: !!restaurantId,
      // paginate,
      ...options,
    }
  );
};

// Liked restaurants hook
export const useLikedRestaurants = (options = {}) => {
  return useApiQuery(
    ['restaurants', 'liked'],
    '/restaurant?moveable=0&liked',
    {},
    {
      ...options,
    }
  );
};

// Liked food trucks hook
export const useLikedFoodTrucks = (options = {}) => {
  return useApiQuery(
    ['restaurants', 'liked', 'food-trucks'],
    '/restaurant?moveable=1&liked',
    {},
    {
      ...options,
    }
  );
};





// Toggle restaurant like/unlike mutation
export const useToggleRestaurantLike = (options = {}) => {
  return useApiMutation('/restaurant/liked', {
    invalidateQueries: [['restaurants'], ['restaurants', 'liked']],
    ...options,
  });
};

// Toggle restaurant like/unlike mutation with dynamic ID
export const useToggleRestaurantLikeById = (restaurantId, options = {}) => {
  return useApiMutation(`/restaurant/liked/${restaurantId}`, {
    method: 'POST',
    invalidateQueries: [
      ['restaurants'], 
      ['restaurants', 'liked'], 
      ['restaurants', 'liked', 'food-trucks'], 
      ['restaurants', restaurantId, 'detail']
    ],
    ...options,
  });
};

// Single product with addons hook
export const useProductWithAddons = (productId, options = {}) => {
  return useApiQuery(
    ['products', productId, 'with-addons'],
    `/product/single/${productId}`,
    {
      includes: 'productAddonCategories.productAddons'
    },
    {
      enabled: !!productId,
      ...options,
    }
  );
};