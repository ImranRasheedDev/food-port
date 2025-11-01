import React from 'react'
import { Link } from 'react-router-dom'
import { processImageUrl } from '@/lib/utils'
const ChickenSandwichCard = ({ image }) => {
    return (
        <div className='flex flex-col md:flex-row rounded-sm md:rounded-3xl h-full md:h-[400px]'>
            <div className='w-full md:w-2/3'>
                <img src={processImageUrl(image)} alt="Chicken Sandwiches" className='block h-full md:h-[400px] w-full object-cover rounded-tl-sm md:rounded-tl-3xl rounded-bl-sm md:rounded-bl-3xl md:rounded-tr-none md:rounded-br-none' />
                </div>
            <div className='bg-red-600 w-full md:w-2/3 px-2 py-8 md:py-12 md:px-16 text-white flex justify-center items-center flex-col rounded-tr-sm md:rounded-tr-3xl rounded-br-sm md:rounded-br-3xl md:rounded-tl-none md:rounded-bl-none h-full md:h-[400px]'>
                <div className='text-start w-full'>
                    <h3 className='text-sm md:text-xl font-bold leading-tight mb-4'>
                        Celebrate parties with Chicken Sandwiches
                    </h3>
                    <p className='text-sm md:text-base mb-6 leading-relaxed'>
                        Get the best fried chicken smeared with a lip smacking lemon chili flavor. Check out best deals for fried chicken.
                    </p>
                    <Link to={""} className="rounded-lg bg-white font-semibold flex items-center justify-center text-center w-full text-red-600 h-12 text-base">
                        Proceed to order
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ChickenSandwichCard
