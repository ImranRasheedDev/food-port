import LayoutWrapper from "../layoutWrapper";

export default function HeroBanner({ user = false }) {
    return (
        <section
            className={`${user ? "bg-[url('/images/hero-bg-2.png')] min-h-[500px]" : "bg-[url('/images/hero-bg.png')] min-h-screen"} relative  flex items-center justify-start bg-cover bg-center `}
        >
            <LayoutWrapper>
            {
                user ? <>
                    <div className="absolute bottom-0 right-0 ml-auto text-right">
                        <img src="/images/banner-right.png" alt="" />
                    </div>
                </> : <></>
            }
            <div className="relative">
                <div className="">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                    </h1>
                    <p className="text-lg text-white/90 mb-8 max-w-4xl">
                        Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                        established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                    </p>
                    {
                        user ? (
                            <></>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <img
                                    src="/images/app-store.png"
                                    alt="Download on App Store"
                                    className="h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <img
                                    src="/images/googleplay.png"
                                    alt="Get it on Google Play"
                                    className="h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            </LayoutWrapper>
        </section>
    )
}
