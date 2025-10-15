// Core API hooks
export {
  useApiQuery,
  useApiMutation,
  useApiUpdateMutation,
  useApiDeleteMutation,
  useApiForm,
 
} from './useApi';

// User-specific hooks
export {
  
  useUser,
  useUpdateUser,
  useDeleteUser,
  useRegisterUser,
  useLoginUser,
  useForgotPassword,
  useLogout,
  useResetPassword,
  useAddAddress,
  useAddress,
  useUserAddresses,
  useAllAddresses,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from './useUsers';

// Generic resource hooks
export {
  createResourceHooks,
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
  useCategories,
  useCategory,
} from './useResource';

export  {
  useRestaurants,
  useRestaurant,
  useRestaurantDetail,
  useLikedRestaurants,
  useToggleRestaurantLike,
  useToggleRestaurantLikeById,
  useProductWithAddons,
} from './useResource' ;

// Order hooks
export {
  useCartCount,
  useInvoices,
  useInvoice,
  usePlaceOrder,
  useUpdateOrderStatus,
  formatCartForAPI,
} from './useOrder';