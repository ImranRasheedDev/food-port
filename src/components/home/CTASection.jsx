import React from 'react'
import { Link } from 'react-router-dom'
import LayoutWrapper from '../layoutWrapper'
import { processImageUrl } from '@/lib/utils';
const CTASection = () => {
    return (
        <LayoutWrapper>
            <div className='flex flex-col lg:flex-row rounded-sm md:rounded-3xl'>
                <div className='w-full lg:w-3/5'>
                    <img src={processImageUrl("/images/cta.png")} alt="" className='block lg:h-[500px] h-[300px] w-full object-cover rounded-tl-sm lg:rounded-tl-3xl rounded-bl-sm lg:rounded-bl-3xl' />
                </div>
                <div className='bg-primary-50 w-full lg:w-2/5 px-4 py-8 lg:py-0 lg:px-14 text-white flex justify-center  flex-col rounded-tr-sm lg:rounded-tr-3xl rounded-br-sm lg:rounded-br-3xl'>
                    <h3 className='text-2xl md:text-5xl font-bold leading-14 mb-6'>
                        Celebrate  parties
                        with Fried Chicken
                    </h3>
                    <p className='mb-6'>
                        Get the best fried chicken smeared with a lip smacking lemon chili flavor. Check out best deals for fried chicken.
                    </p>
                    <Link to={""} className="rounded-lg bg-white font-medium flex items-center justify-center text-center w-full text-primary-50 h-12">
                        Proceed to order
                    </Link>
                </div>
            </div>
        </LayoutWrapper>
    )
}

export default CTASection