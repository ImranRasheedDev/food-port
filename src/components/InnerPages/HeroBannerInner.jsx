import React from 'react'

const HeroBannerInner = () => {
    return (
        <section
            className={`bg-[url('/images/hero-bg-2.png')] h-[300px] relative  flex items-center justify-start bg-cover bg-center`}
        >
            <div className="absolute bottom-0 right-0 ml-auto text-right">
                <img src="/images/inner-banner.png" alt="" />
            </div>
            <div className="container mx-auto px-4  relative">
                <div className="max-w-5xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                    </h1>
                    <p className="text-lg text-white/90 mb-8 max-w-4xl">
                        Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                        established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default HeroBannerInner