import { X } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SearchCard = ({ img, name, address, to, onClick }) => {
    const content = (
        <div className='flex items-center w-full'>
            <div className='flex gap-x-3'>
                <div className='w-12 h-12 rounded-md'>
                    <img src={img} alt={name} className='w-full h-full object-cover' />
                </div>
                <div>
                    <h2 className='text-primary-100 font-medium'>{name}</h2>
                    <p className='text-primary-1001/50 font-medium'>{address}</p>
                </div>
            </div>
            <button className="bg-white border border-black h-6 w-6 flex justify-center items-center ml-auto rounded-full  cursor-pointer" onClick={(e) => e.preventDefault()}>
                <X className="w-4 h-4 text-black" />
            </button>
        </div>
    )

    return to ? (
        <Link to={to} onClick={onClick} className="flex items-center bg-white hover:bg-primary-1000 hover:shadow-lg px-4 py-6 not-last:border-b not-last:border-gray-300 last:rounded-br-md last:rounded-bl-md">
            {content}
        </Link>
    ) : (
        <div className="flex items-center bg-white hover:bg-primary-1000 hover:shadow-lg px-4 py-6 not-last:border-b not-last:border-gray-300 last:rounded-br-md last:rounded-bl-md" onClick={onClick}>
            {content}
        </div>
    )
}

export default SearchCard