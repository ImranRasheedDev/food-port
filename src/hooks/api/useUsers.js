import { 
  useApiQuery, 
  useApiMutation, 
  useApiUpdateMutation, 
  useApiDeleteMutation 
} from './useApi';



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
    onSuccess: (data) => {
    },
    ...options,
  });
};