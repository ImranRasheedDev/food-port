import React from 'react'
import { Link } from 'react-router-dom'

const DealDiscountCard = ({ title, companyName, link, image }) => {
    return (
        <div className={` text-white  bg-amber-900`}>
            <div className='pl-4 w-3/5'>
                <h3 className='text-lg leading-5 font-bold mb-3'>
                    {title} <span className='text-primary-1002'>{companyName}</span>
                </h3>
                <Link to={link} className={`bg-white rounded-4xl inline-block px-10 py-2 font-medium text-primary-50`}>
                    Order Now
                </Link>
            </div>
            <div className='ml-auto ronded-tr-4xl rounded-br-4xl  flex justify-end h-32'>
                <img src={image} alt={companyName} className='object-cover ronded-tr-4xl rounded-br-4xl block' />
            </div>
        </div>
    )
}

export default DealDiscountCard