import React from 'react'
import { Link } from 'react-router-dom'
import LayoutWrapper from '../layoutWrapper'
const CTASection = () => {
    return (
        <LayoutWrapper>
            <div className='flex flex-col md:flex-row rounded-sm md:rounded-3xl'>
                <div className='w-full md:w-3/5'>
                    <img src="/images/cta.png" alt="" className='block h-[500px] w-full object-cover rounded-tl-sm md:rounded-tl-3xl rounded-bl-sm md:rounded-bl-3xl' />
                </div>
                <div className='bg-primary-50 w-full md:w-2/5 px-4 py-8 md:py-0 md:px-14 text-white flex justify-center  flex-col rounded-tr-sm md:rounded-tr-3xl rounded-br-sm md:rounded-br-3xl'>
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