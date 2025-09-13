# React Query API Hooks

A comprehensive set of reusable React Query hooks for handling API operations with React Hook Form integration and react-toastify error handling.

## Features

- ✅ **Simple & Reusable**: Easy-to-use hooks for GET, POST, PUT/PATCH, DELETE operations
- ✅ **Scalable**: Generic resource hooks that work with any API endpoint
- ✅ **Performant**: Built-in caching, deduplication, and optimistic updates
- ✅ **Query Support**: Pagination, search, filtering, and sorting
- ✅ **Form Integration**: Seamless integration with React Hook Form
- ✅ **Error Handling**: Automatic error display with react-toastify
- ✅ **Loading States**: Built-in loading and error states
- ✅ **Query Invalidation**: Automatic cache invalidation after mutations

## Setup

### 1. Install Dependencies

```bash
npm install @tanstack/react-query react-hook-form react-toastify
```

### 2. Setup Query Provider

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import QueryProvider from './providers/QueryProvider';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
      <ToastContainer position="top-right" />
    </QueryProvider>
  </React.StrictMode>
);
```

### 3. Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Core Hooks

### useApiQuery (GET requests)

```jsx
import { useApiQuery } from './hooks/api';

// Basic usage
const { data, isLoading, error } = useApiQuery(
  ['users'], // Query key
  '/users',  // Endpoint
  {},        // Query parameters (optional)
  {}         // React Query options (optional)
);

// With pagination, search, and filters
const { data, isLoading, error } = useApiQuery(
  ['users'],
  '/users',
  {
    page: 1,
    per_page: 10,
    search: 'john',
    status: 'active',
    sort: 'created_at',
    order: 'desc'
  }
);
```

### useApiMutation (POST requests)

```jsx
import { useApiMutation } from './hooks/api';

const createUser = useApiMutation('/users', {
  invalidateQueries: ['users'], // Invalidate users list after creation
  onSuccess: (data) => {
    console.log('User created:', data);
  }
});

// Usage
const handleCreate = () => {
  createUser.mutate({
    name: 'John Doe',
    email: 'john@example.com'
  });
};
```

### useApiUpdateMutation (PUT/PATCH requests)

```jsx
import { useApiUpdateMutation } from './hooks/api';

const updateUser = useApiUpdateMutation(`/users/${userId}`, 'PUT', {
  invalidateQueries: [['users'], ['users', userId]],
  onSuccess: (data) => {
    console.log('User updated:', data);
  }
});

// Usage
updateUser.mutate({
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

### useApiDeleteMutation (DELETE requests)

```jsx
import { useApiDeleteMutation } from './hooks/api';

const deleteUser = useApiDeleteMutation('/users', {
  invalidateQueries: ['users'],
  onSuccess: () => {
    console.log('User deleted');
  }
});

// Usage
deleteUser.mutate(userId);
```

## Resource-Specific Hooks

### User Hooks

```jsx
import { 
  useUsers, 
  useUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser 
} from './hooks/api';

// Get all users with pagination
const { data: users, isLoading } = useUsers({
  page: 1,
  per_page: 10,
  search: 'john'
});

// Get single user
const { data: user } = useUser(userId);

// Create user
const createUser = useCreateUser();

// Update user
const updateUser = useUpdateUser(userId);

// Delete user
const deleteUser = useDeleteUser();
```

### Generic Resource Hooks

```jsx
import { createResourceHooks } from './hooks/api';

// Create hooks for any resource
const {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} = createResourceHooks('products', '/products');

// Usage is the same as user hooks
const { data: products } = useProducts({ category: 'electronics' });
const createProduct = useCreateProduct();
```

## Form Integration

### useApiForm Hook

```jsx
import { useForm } from 'react-hook-form';
import { useCreateUser, useApiForm } from './hooks/api';

const UserForm = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const createMutation = useCreateUser({
    onSuccess: () => {
      console.log('User created successfully');
    }
  });

  const { handleSubmit, isLoading } = useApiForm(createMutation, form);

  return (
    <form onSubmit={handleSubmit}>
      <input {...form.register('name')} placeholder="Name" />
      <input {...form.register('email')} placeholder="Email" />
      <input {...form.register('password')} type="password" placeholder="Password" />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

## Error Handling

The hooks automatically handle server-side validation errors and display them using react-toastify:

```jsx
// Server response with validation errors
{
  "message": "The name field is required. (and 2 more errors)",
  "errors": {
    "name": ["The name field is required."],
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

Each error will be displayed as a separate toast notification, and if using `useApiForm`, the errors will also be set on the form fields.

## Advanced Usage

### Custom Query Options

```jsx
const { data, isLoading } = useApiQuery(
  ['users'],
  '/users',
  {},
  {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: true,
    enabled: someCondition, // Conditional fetching
  }
);
```

### Multiple Query Invalidation

```jsx
const createUser = useApiMutation('/users', {
  invalidateQueries: [
    ['users'],           // Invalidate users list
    ['dashboard'],       // Invalidate dashboard data
    ['statistics']       // Invalidate statistics
  ]
});
```

### Optimistic Updates

```jsx
const updateUser = useApiUpdateMutation(`/users/${userId}`, 'PUT', {
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['users', userId]);

    // Snapshot previous value
    const previousUser = queryClient.getQueryData(['users', userId]);

    // Optimistically update
    queryClient.setQueryData(['users', userId], newData);

    return { previousUser };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['users', userId], context.previousUser);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries(['users', userId]);
  }
});
```

## Authentication

The hooks automatically include the authentication token from localStorage:

```jsx
// Token is automatically added to requests
localStorage.setItem('access_token', 'your-jwt-token');

// All subsequent API calls will include:
// Authorization: Bearer your-jwt-token
```

## Best Practices

1. **Use specific query keys**: `['users', userId]` instead of just `['users']`
2. **Invalidate related queries**: After creating/updating/deleting, invalidate all related queries
3. **Handle loading states**: Always show loading indicators for better UX
4. **Use keepPreviousData**: For pagination to prevent loading states between pages
5. **Set appropriate stale times**: Based on how often your data changes
6. **Use enabled option**: For conditional queries that depend on other data

## Examples

Check the `/examples` folder for complete working examples:

- `UserForm.jsx` - Form with validation and error handling
- `UserList.jsx` - List with pagination, search, and filters
- `CompleteExample.jsx` - Full CRUD operations in one component

## API Response Format

The hooks expect your API to return responses in this format:

### Success Response
```json
{
  "success": true,
  "data": { /* your data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "message": "Validation failed",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [/* array of items */],
  "pagination": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 10,
    "total": 100,
    "from": 1,
    "to": 10
  }
}
```