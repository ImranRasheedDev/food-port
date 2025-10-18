import { 
  useApiQuery, 
  useApiMutation, 
  useApiUpdateMutation, 
  useApiDeleteMutation 
} from './useApi';
import { 
  useUpdateAddress, 
  useDeleteAddress, 
  useSetDefaultAddress 
} from './useAddressMutations';



// Get single user
export const useUser = (id, options = {}) => {
  return useApiQuery(
    ['users', id],
    `/users/${id}`,
    {},
    {
      enabled: !!id,
      ...options,
    }
  );
};



// Update user
export const useUpdateUser = (options = {}) => {
  return useApiUpdateMutation("/profile", "POST", {
    ...options,
  });
};

// Delete user
export const useDeleteUser = (options = {}) => {
  return useApiDeleteMutation('/users', {
    invalidateQueries: ['users'],
    ...options,
  });
};

// Register user
export const useRegisterUser = (options = {}) => {
  return useApiMutation('/register', {
    onSuccess: (data) => {
    },
    ...options,
  });
};

// Login user
export const useLoginUser = (options = {}) => {
  return useApiMutation('/login', {
    onSuccess: (data) => {
    },
    ...options,
  });
};

// Forgot Password
export const useForgotPassword = (options = {}) => {
  return useApiMutation('/forget-password', {
    onSuccess: (data) => {
    },
    ...options,
  });
};

// Reset Password
export const useResetPassword = (options = {}) => {
  return useApiMutation('/reset-password', {
    onSuccess: (data) => {
    },
    ...options,
  });
};

// Logout
export const useLogout = (options = {}) => {
  return useApiMutation('/logout', {
    onSuccess: (data) => {
    },
    ...options,
  });
};


export const useAddAddress = (options = {}) => {
  return useApiMutation('/address/add', {
    invalidateQueries: [['addresses'], ['user-addresses'], ['address']],
    disableToast: true, // Disable automatic toast for address
    ...options,
  });
};

// Get specific address by ID
export const useAddress = (address_id, options = {}) => {
  return useApiQuery(
    ['address', address_id],
    `/address/${address_id}`,
    {},
    {
      enabled: !!address_id,
      ...options,
    }
  );
};

// Get user addresses by user ID
export const useUserAddresses = (user_id, options = {}) => {
  return useApiQuery(
    ['user-addresses', user_id],
    `/users/${user_id}/addresses`,
    {},
    {
      enabled: !!user_id,
      ...options,
    }
  );
};

// Get all addresses
export const useAllAddresses = (options = {}) => {
  return useApiQuery(
    ['addresses'],
    '/address',
    {},
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    }
  );
};

// Re-export the custom address mutation hooks
export { useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from './useAddressMutations';