import React, { useState, useEffect } from 'react'
import CheckboxGroup from './CheckboxGroup'
import { suggestedFilters, distanceFilters } from '../MockData'
import { useCategories } from '@/hooks/api'
import { SkeletonCard } from '@/components/ui/skeleton'

const ProductFilters = ({ filters, onFiltersChange }) => {
    const [priceRange, setPriceRange] = useState(filters.price_range || '')
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories()

    // Convert API categories to filter format
    const categoryFilters = categoriesData?.data?.map(cat => ({
        id: cat.id,
        label: cat.name
    })) || []

    // Handle price range change - toggle behavior
    const handlePriceRangeChange = (range) => {
        // If clicking the same price that's already selected, deselect it
        if (priceRange === range) {
            setPriceRange('')
            onFiltersChange({ ...filters, price_range: '' })
        } else {
            // Otherwise, select the new price
            setPriceRange(range)
            onFiltersChange({ ...filters, price_range: range })
        }
    }

    // Handle filter changes - Only one selection per group
    const handleFilterChange = (filterType, itemId, checked) => {
        let newFilters
        
        if (checked) {
            // Replace entire array with single selection (radio button behavior)
            newFilters = [itemId]
        } else {
            // Remove selection if unchecked
            newFilters = []
        }
        
        onFiltersChange({ ...filters, [filterType]: newFilters })
    }

    return (
        <div className='bg-white rounded-lg p-4 border border-primary-1006'>
            {/* Price Range - Radio Buttons */}
            <div className='border-b border-primary-1006 pb-6 mb-6 mx-7 pt-7'>
                <h2 className='text-primary-1008 text-sm font-semibold mb-3'>
                    Price
                </h2>
                <div className='flex gap-2'>
                    {[
                        { value: '5', label: '$5' },
                        { value: '10', label: '$10' },
                        { value: '50', label: '$50' }
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handlePriceRangeChange(option.value)}
                            className={`w-full border border-primary-1010 rounded-4xl text-center h-8 text-sm font-medium transition-colors ${
                                priceRange === option.value 
                                    ? 'bg-primary-50 text-white border-primary-50' 
                                    : 'bg-white text-primary-1008 hover:bg-gray-50'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Suggested Filters */}
            <CheckboxGroup 
                title="Suggested" 
                items={suggestedFilters} 
                selectedItems={filters.suggested || []}
                onItemChange={(itemId, checked) => handleFilterChange('suggested', itemId, checked)}
            />

            {/* Dynamic Categories */}
            {categoriesLoading ? (
                <div className="border-b border-primary-1006 pb-6 mb-6 mx-7">
                    <h2 className='text-primary-1008 text-sm font-semibold mb-3'>Category</h2>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center space-x-3 animate-pulse">
                                <div className="w-4 h-4 bg-gray-300 rounded border border-gray-200"></div>
                                <div className="h-4 bg-gray-300 rounded flex-1 max-w-[120px]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <CheckboxGroup 
                    title="Category" 
                    items={categoryFilters} 
                    selectedItems={filters.category || []}
                    onItemChange={(itemId, checked) => handleFilterChange('category', itemId, checked)}
                />
            )}

            {/* Distance Filters */}
            <CheckboxGroup 
                title="Distance" 
                items={distanceFilters} 
                className="border-b-0 pb-0"
                selectedItems={filters.distance || []}
                onItemChange={(itemId, checked) => handleFilterChange('distance', itemId, checked)}
            />
        </div>
    )
}

export default ProductFilters