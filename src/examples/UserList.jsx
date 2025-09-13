import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../hooks/api';

const UserList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    country_code: '',
  });

  // Query parameters for API call
  const queryParams = {
    page,
    per_page: 10,
    search,
    ...filters,
  };

  // Fetch users with pagination, search, and filters
  const { 
    data: usersData, 
    isLoading, 
    error, 
    isFetching 
  } = useUsers(queryParams);

  // Delete user mutation
  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      console.log('User deleted successfully');
    },
  });

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    setPage(1); // Reset to first page when filtering
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const users = usersData?.data || [];
  const pagination = usersData?.pagination || {};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Country Code"
            value={filters.country_code}
            onChange={(e) => handleFilterChange('country_code', e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Loading indicator for refetching */}
      {isFetching && (
        <div className="mb-4 text-blue-500">Updating results...</div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Phone</th>
              <th className="border border-gray-300 p-2 text-left">Gender</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="border border-gray-300 p-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{user.id}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">
                    +{user.country_code} {user.number}
                  </td>
                  <td className="border border-gray-300 p-2 capitalize">
                    {user.gender}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => console.log('Edit user:', user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {pagination.from || 1} to {pagination.to || users.length} of{' '}
            {pagination.total} results
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 bg-blue-500 text-white rounded">
              {page}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= (pagination.last_page || 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;