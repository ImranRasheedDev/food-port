import { Send, X } from 'lucide-react'
import React from 'react'

const LocationSearchCard = ({ address }) => {
    return (
        <div className="flex items-center bg-white hover:bg-primary-1000 hover:shadow-lg px-4 py-8 not-last:border-b not-last:border-gray-300 last:rounded-br-md last:rounded-bl-md">
            <div className='flex gap-x-3 items-center'>
                <div className='rounded-md'>
                    <Send className='text-primary-200' />
                </div>
                <div>
                    <h2 className='text-primary-100 font-medium'>{address}</h2>
                </div>
            </div>
            <button className="bg-white border border-black h-6 w-6 flex justify-center items-center ml-auto rounded-full  cursor-pointer">
                <X className="w-4 h-4 text-black" />
            </button>
        </div>
    )
}

export default LocationSearchCard