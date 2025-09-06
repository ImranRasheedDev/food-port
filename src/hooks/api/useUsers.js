import { 
  useApiQuery, 
  useApiMutation, 
  useApiUpdateMutation, 
  useApiDeleteMutation 
} from './useApi';

// Get all users with pagination, search, and filters
export const useUsers = (params = {}) => {
  return useApiQuery(
    ['users'],
    '/users',
    params,
    {
      keepPreviousData: true, // For pagination
    }
  );
};

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

// Create user
export const useCreateUser = (options = {}) => {
  return useApiMutation('/users', {
    invalidateQueries: ['users'],
    ...options,
  });
};

// Update user
export const useUpdateUser = (id, options = {}) => {
  return useApiUpdateMutation(`/users/${id}`, 'PUT', {
    invalidateQueries: [['users'], ['users', id]],
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

// Register user (special case)
export const useRegisterUser = (options = {}) => {
  return useApiMutation('/register', {
    onSuccess: (data) => {
      // Store token if registration includes it
      if (data.data?.access_token) {
        localStorage.setItem('access_token', data.data.access_token);
      }
    },
    ...options,
  });
};

// Login user
export const useLoginUser = (options = {}) => {
  return useApiMutation('/login', {
    onSuccess: (data) => {
      // Store token on successful login
      if (data.data?.access_token) {
        localStorage.setItem('access_token', data.data.access_token);
      }
    },
    ...options,
  });
};