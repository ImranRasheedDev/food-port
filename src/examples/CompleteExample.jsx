import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useApiForm,
} from '../hooks/api';

const CompleteExample = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Form setup
  const form = useForm({
    defaultValues: {
      name: '',
      price: '',
      description: '',
      category: '',
    },
  });

  // Query for products with pagination and search
  const { 
    data: productsData, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useProducts({
    page,
    per_page: 5,
    search,
  });

  // Mutations
  const createMutation = useCreateProduct({
    onSuccess: (data) => {
      toast.success('Product created successfully!');
      form.reset();
    },
  });

  const updateMutation = useUpdateProduct(editingProduct?.id, {
    onSuccess: (data) => {
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      form.reset();
    },
  });

  const deleteMutation = useDeleteProduct({
    onSuccess: () => {
      toast.success('Product deleted successfully!');
    },
  });

  // Form integration
  const mutation = editingProduct ? updateMutation : createMutation;
  const { handleSubmit, isLoading: isSubmitting } = useApiForm(mutation, form);

  // Handlers
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    form.reset();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const products = productsData?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                {...form.register('name', { required: 'Name is required' })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                {...form.register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                type="number"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
              />
              {form.formState.errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                {...form.register('category', { required: 'Category is required' })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food</option>
                <option value="books">Books</option>
              </select>
              {form.formState.errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...form.register('description')}
                rows="3"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting 
                  ? (editingProduct ? 'Updating...' : 'Creating...') 
                  : (editingProduct ? 'Update Product' : 'Create Product')
                }
              </button>
              
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1 border rounded-md"
            />
          </div>

          {isLoadingProducts ? (
            <div className="text-center py-8">Loading products...</div>
          ) : productsError ? (
            <div className="text-red-500 text-center py-8">
              Error: {productsError.message}
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No products found
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600">${product.price}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {product.category}
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-700 mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {productsData?.pagination && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Page {page} of {productsData.pagination.last_page || 1}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= (productsData.pagination.last_page || 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteExample;