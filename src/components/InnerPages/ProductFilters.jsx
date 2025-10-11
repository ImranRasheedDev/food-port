import React from 'react'
import CheckboxGroup from './CheckboxGroup'
import { suggestedFilters, categoryFilters, distanceFilters } from '../MockData'

const ProductFilters = () => {
    return (
        <div className='bg-white rounded-lg p-4 border border-primary-1006'>
            <div className='border-b border-primary-1006 pb-6 mb-6 mx-7 pt-7'>
                <h2 className='text-primary-1008 text-sm font-semibold mb-3'>
                    Price
                </h2>
                <div className='flex gap-2'>
                    <div>
                        <input type="text" className='w-full border border-primary-1010 rounded-4xl text-center h-8' placeholder='$' />
                    </div>
                    <div>
                        <input type="text" className='w-full border border-primary-1010 rounded-4xl text-center h-8' placeholder='$$' />
                    </div>
                    <div>
                        <input type="text" className='w-full border border-primary-1010 rounded-4xl text-center h-8' placeholder='$$$' />
                    </div>
                </div>
            </div>
            <CheckboxGroup title="Suggested" items={suggestedFilters} />
            <CheckboxGroup title="Category" items={categoryFilters} />
            <CheckboxGroup title="Distance" items={distanceFilters} className="border-b-0 pb-0" />
        </div>
    )
}

export default ProductFilters