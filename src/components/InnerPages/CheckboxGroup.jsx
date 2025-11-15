import React from 'react'
import { Checkbox } from '../ui/checkbox'

const CheckboxGroup = ({ title, items, className = "", selectedItems = [], onItemChange }) => {
    return (
        <div className={`border-b border-primary-1006 pb-3 pt-3 xl:pb-6 mb-6 xl:pt-7 xl:mx-7 mx-3 ${className}`}>
            <h2 className='text-primary-1008 text-sm font-semibold mb-3'>
                {title}
            </h2>
            <div className='space-y-3'>
                {items.map((item, index) => (
                    <div key={item.id || index} className='flex items-center space-x-2'>
                        <Checkbox
                            id={item.id}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => onItemChange?.(item.id, checked)}
                        />
                        <label htmlFor={item.id} className='text-sm text-primary-1008 cursor-pointer'>
                            {item.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CheckboxGroup
