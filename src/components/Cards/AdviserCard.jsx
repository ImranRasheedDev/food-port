import React from 'react'
import { Link } from 'react-router-dom'
import placeholder from "../../../public/images/advertise.png";
import { isValidUrl } from '@/lib/inValidUrl';
import { processImageUrl } from '@/lib/utils';

const AdviserCard = ({ title, companyName, description, link, index, mediaPath, onClick }) => {
    const isOdd = index % 2 === 0;

    const bgClass = isOdd ? "bg-primary-1003" : "bg-primary-1004";
    const btnTextClass = isOdd ? "text-primary-50" : "text-primary-1004";


    const src = isValidUrl(mediaPath) ? mediaPath : placeholder;

    return (
        <>
            {/* <div */}
            {/* // className={`${bgClass} min-h-[300px] flex flex-col md:flex-row gap-x-10 gap-y-5 text-white rounded-4xl items-center cursor-pointer`}  */}

            {/* > */}
            {/* <div className='pl-4 md:pl-10 py-6 md:py-10 w-full md:w-3/5'>
                    <h3 className='text-xl md:text-2xl font-bold leading-8 md:leading-10'>
                        {title} <span className='text-primary-1002'>{companyName}</span>
                    </h3>
                    <p className='leading-normal py-3 md:py-5 text-sm md:text-base'>
                        {description}
                    </p>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onClick?.(); }} className={`bg-white rounded-4xl inline-block px-6 md:px-10 py-2 font-medium text-sm md:text-base ${btnTextClass}`}>
                        Order Now
                    </button>
                </div> */}
            {/* </div> */}
            <div className='w-full' onClick={onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onClick?.(); } }}>
                <img
                    src={processImageUrl("/images/placeholder1.jpg")}
                    alt=""
                    onError={(e) => { if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
                    className='cursor-pointer'
                // className='rounded-b-4xl md:ronded-tr-4xl md:rounded-br-4xl block w-full max-w-sm md:max-w-none h-48 md:h-60 object-cover'
                />
            </div>

        </>
    )
}

export default AdviserCard