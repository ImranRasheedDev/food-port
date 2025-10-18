import React from 'react'
import { Link } from 'react-router-dom'

const DialyDealsCard = ({ title, description, link }) => {
    return (
        <div>
            <div className='flex flex-col md:flex-row rounded-xl'>
                <div className='w-full md:w-2/5 bg-primary-50 text-white rounded-tl-xl rounded-bl-xl md:rounded-tr-none md:rounded-br-none rounded-br-none flex justify-center flex-col px-6 md:px-14 py-8 md:py-0 bg-[url("/images/bg-deals-1.png")] bg-no-repeat bg-cover'>
                    <h3 className="text-2xl md:text-4xl font-bold leading-8 md:leading-10 mb-3">
                        {title.split(" ").slice(0, -2).join(" ")}{" "}
                        <span className="text-primary-1005">
                            {title.split(" ").slice(-2).join(" ")}
                        </span>
                    </h3>
                    <p className='font-semibold mb-6 text-sm md:text-base'>
                        {description}
                    </p>
                    <Link to={link} className="rounded-lg shadow-[0px_14px_32px_0px_#FFB20E4A] bg-white font-medium flex items-center justify-center text-center w-full text-primary-50 h-10 md:h-12">
                        Proceed to order
                    </Link>
                </div>
                <div className='w-full md:w-3/5 rounded-tr-none rounded-br-xl rounded-bl-xl md:rounded-bl-none md:rounded-tl-none h-[200px] md:h-[320px]'>
                    <img src="/images/daily-deals-image.jpg" alt="" className='block h-full w-full object-cover rounded-br-xl rounded-bl-xl md:rounded-bl-none md:rounded-tr-xl' />
                </div>
            </div>
        </div>
    )
}

export default DialyDealsCard