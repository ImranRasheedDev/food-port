import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateUser, useUpdateUser, useApiForm } from '../hooks/api';

const UserForm = ({ user = null, onSuccess }) => {
  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      number: user?.number || '',
      country_code: user?.country_code || '',
      dob: user?.dob || '',
      gender: user?.gender || '',
    },
  });

  // Use create or update mutation based on whether user exists
  const createMutation = useCreateUser({
    onSuccess: (data) => {
      console.log('User created:', data);
      onSuccess?.(data);
    },
  });

  const updateMutation = useUpdateUser(user?.id, {
    onSuccess: (data) => {
      console.log('User updated:', data);
      onSuccess?.(data);
    },
  });

  const mutation = user ? updateMutation : createMutation;
  const { handleSubmit, isLoading } = useApiForm(mutation, form);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {user ? 'Update User' : 'Create User'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...form.register('name', { required: 'Name is required' })}
          className="w-full p-2 border rounded-md"
          placeholder="Enter name"
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...form.register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="w-full p-2 border rounded-md"
          placeholder="Enter email"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...form.register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            type="password"
            className="w-full p-2 border rounded-md"
            placeholder="Enter password"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          {...form.register('number', { required: 'Phone number is required' })}
          className="w-full p-2 border rounded-md"
          placeholder="Enter phone number"
        />
        {form.formState.errors.number && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.number.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country Code</label>
        <input
          {...form.register('country_code', { required: 'Country code is required' })}
          className="w-full p-2 border rounded-md"
          placeholder="Enter country code"
        />
        {form.formState.errors.country_code && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.country_code.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          {...form.register('dob', { required: 'Date of birth is required' })}
          type="date"
          className="w-full p-2 border rounded-md"
        />
        {form.formState.errors.dob && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.dob.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <select
          {...form.register('gender', { required: 'Gender is required' })}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {form.formState.errors.gender && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.gender.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
      </button>
    </form>
  );
};

export default UserForm;