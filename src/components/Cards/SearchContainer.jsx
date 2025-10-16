import React from 'react'

const SearchContainer = ({ children, ...props }) => {
    return (
        <div className='absolute top-full left-0 w-full z-50 bg-white shadow-lg rounded-br-md rounded-bl-md max-h-80 overflow-auto' {...props}>
            {children}
        </div>
    )
}

export default SearchContainer