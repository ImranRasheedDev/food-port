import React from 'react'
import { Link } from 'react-router-dom'

const DialyDealsCard = ({ title, description, link }) => {
    return (
        <div>
            <div className='flex rounded-xl'>
                <div className='w-2/5 bg-primary-50 text-white rounded-tl-xl rounded-bl-xl flex justify-center flex-col px-14 bg-[url("/images/bg-deals-1.png")] bg-no-repeat bg-cover'>
                    <h3 className="text-4xl font-bold leading-10 mb-3">
                        {title.split(" ").slice(0, -2).join(" ")}{" "}
                        <span className="text-primary-1005">
                            {title.split(" ").slice(-2).join(" ")}
                        </span>
                    </h3>
                    <p className='font-semibold mb-6'>
                        {description}
                    </p>
                    <Link to={link} className="rounded-lg shadow-[0px_14px_32px_0px_#FFB20E4A] bg-white font-medium flex items-center justify-center text-center w-full text-primary-50 h-12">
                        Proceed to order
                    </Link>
                </div>
                <div className='w-3/5 rounded-tr-xl rounded-tl-xl h-[320px]'>
                    <img src="/images/daily-deals-image.jpg" alt="" className='block h-full w-full object-cover rounded-tr-xl rounded-br-xl' />
                </div>
            </div>
        </div>
    )
}

export default DialyDealsCard