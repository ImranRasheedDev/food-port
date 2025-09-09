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
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './useResource';