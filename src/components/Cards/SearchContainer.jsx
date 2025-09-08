import React from 'react'

const SearchContainer = ({ children }) => {
    return (
        <div className='absolute top-full left-0 w-full z-10 bg-white shadow-lg rounded-br-md rounded-bl-md'>
            {children}
        </div>
    )
}

export default SearchContainer