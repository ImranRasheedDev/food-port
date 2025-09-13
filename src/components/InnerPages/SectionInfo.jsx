import React from 'react'

const SectionInfo = ({ title, description }) => {
    return (
        <>
            <h3 className='text-2xl font-bold mb-3'>
                {title}
            </h3>
            <p className='text-primary-300 mb-5'>
                {description}
            </p>
        </>
    )
}

export default SectionInfo