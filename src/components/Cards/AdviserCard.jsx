import React from 'react'
import { Link } from 'react-router-dom'
import placeholder from "../../../public/images/placeholder.jpg";
const AdviserCard = ({ title, companyName, description, link, index, mediaPath }) => {
    const isOdd = index % 2 === 0;

    const bgClass = isOdd ? "bg-primary-1003" : "bg-primary-1004";
    const btnTextClass = isOdd ? "text-primary-50" : "text-primary-1004";

    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        try {
            const parsed = new URL(url, window.location.origin);
            const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
            const isRootRelative = url.startsWith('/');
            return isHttp || isRootRelative;
        } catch {
            return url.startsWith('/');
        }
    };
    const src = isValidUrl(mediaPath) ? mediaPath : placeholder;
    return (
        <div className={`${bgClass} min-h-[300px] flex gap-x-10 text-white rounded-4xl items-center`}>
            <div className='pl-10 py-10 w-3/5'>
                <h3 className='text-2xl font-bold leading-10'>
                    {title} <span className='text-primary-1002'>{companyName}</span>
                </h3>
                <p className='leading-normal py-5'>
                    {description}
                </p>
                <Link to={link} className={`bg-white rounded-4xl inline-block px-10 py-2 font-medium ${btnTextClass}`}>
                    Order Now
                </Link>
            </div>
            <div className='ml-auto ronded-tr-4xl rounded-br-4xl w-2/5 flex justify-end'>
                <img
                    src={src}
                    alt=""
                    onError={(e) => { if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
                    className='ronded-tr-4xl rounded-br-4xl block w-full h-60 object-cover'
                />
            </div>
        </div>
    )
}

export default AdviserCard