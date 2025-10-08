import React from 'react'
import { Link } from 'react-router-dom'

const DealDiscountCard = ({ title, companyName, link, cardIndex = 0 }) => {
    // Determine card style based on index (cycles through 0, 1, 2)
    const styleIndex = cardIndex % 3;

    // Card style configurations
    const cardStyles = {
        0: { // First card
            containerClass: 'bg-[url("/images/deal-bg-1.png")]',
            titleClass: 'text-white',
            companyClass: 'text-primary-1002',
            buttonClass: 'bg-white text-primary-1004'
        },
        1: { // Second card
            containerClass: 'bg-[url("/images/deal-bg-3.png")]',
            titleClass: 'text-white',
            companyClass: 'text-primary-1002',
            buttonClass: 'bg-primary-50 text-white'
        },
        2: { // Third card
            containerClass: 'bg-[url("/images/deal-bg-2.png")]',
            titleClass: 'text-white',
            companyClass: 'text-white',
            buttonClass: 'bg-black text-white'
        }
    };

    const currentStyle = cardStyles[styleIndex];

    return (
        <div className={`text-white items-center flex ${currentStyle.containerClass} rounded-sm bg-cover bg-center bg-no-repeat`}>
            <div className='pl-4 w-[64%] py-6'>
                <h3 className='text-lg leading-5 font-bold mb-3'>
                    <span className={currentStyle.titleClass}>{title}</span> <span className={currentStyle.companyClass}>{companyName}</span>
                </h3>
                <Link to={link} className={`${currentStyle.buttonClass} rounded-4xl inline-block px-6 py-2 font-medium text-sm`}>
                    Order Now
                </Link>
            </div>
        </div>
    )
}

export default DealDiscountCard