import React from 'react'
import { Checkbox } from '../ui/checkbox'

const CheckboxGroup = ({ title, items, className = "", selectedItems = [], onItemChange }) => {
    return (
        <div className={`border-b border-primary-1006 pb-6 mb-6 mx-7 ${className}`}>
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
