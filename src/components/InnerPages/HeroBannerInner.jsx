import React from 'react'
import { processImageUrl } from '@/lib/utils';

const HeroBannerInner = () => {
    return (
        <section
            className={`bg-[url('/images/hero-bg-2.png')] h-[250px] sm:h-[400px] md:h-[300px] relative flex items-center justify-start bg-cover bg-center`}
        >
            <div className="absolute bottom-0 -right-40 ml-auto text-right hidden sm:block">
                <img src={processImageUrl("/images/inner-banner.png")} className="w-full h-full object-cover" alt="Inner Banner" />
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full px-4 sm:px-6 md:px-8">
                <div className="max-w-[1280px] mx-auto">
                    <div className="max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
                            Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                            established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroBannerInner