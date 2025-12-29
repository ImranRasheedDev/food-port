import LayoutWrapper from "../layoutWrapper";
import { processImageUrl } from '@/lib/utils';
export default function HeroBanner({ user = false }) {
    return (
        <>
            {
                user ? (

                    <>
                        <div className="h-[72px]" />
                        <section className="bg-[url('/images/hero-bg-2.png')] lg:h-[400px] h-[200px] bg-no-repeat bg-cover bg-center">
                            <LayoutWrapper className="h-full relative">
                                <div className="flex flex-col justify-center h-full">
                                    <h1 className="text-2xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                        Discover Flavours from Top <br />
                                        Restaurants & Food Truck
                                    </h1>
                                    <p className="lg:text-base text-sm  text-white/90 mb-8">
                                        Food Port, a new food ordering app, faced the challenge of entering a crowded <br /> market saturated with
                                        established players. They needed to attract the hungry foodies, <br /> restaurant and food truck owners.
                                    </p>
                                </div>
                                <div className="items-end  justify-end absolute bottom-0 right-0 hidden lg:flex">
                                    <img src="/images/banner-right.png" alt="" className="w-[90%]" />
                                </div>
                            </LayoutWrapper>
                        </section>
                    </>

                ) : (
                    <>
                        <div className="h-[72px]" />
                        <section className="bg-[url('/images/hero-bg.png')] min-h-screen flex items-center justify-start bg-cover bg-center">
                            <LayoutWrapper>
                                <div className="flex py-24 md:12 lg:0 items-center  justify-start">
                                    <div className="flex flex-col items-start justify-start">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                            DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                                        </h1>
                                        <p className="text-lg text-white/90 mb-8 max-w-4xl">
                                            Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                                            established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                                        </p>
                                        <div className="flex py-4 md:py-0 flex-col sm:flex-row gap-4">
                                            <img
                                                src={processImageUrl("/images/app-store.png")}
                                                alt="Download on App Store"
                                                className="h-auto md:h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                            <img
                                                src={processImageUrl("/images/googleplay.png")}
                                                alt="Get it on Google Play"
                                                className="h-auto md:h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </LayoutWrapper>
                        </section>
                    </>
                )
            }
            {/* <section
                className={`${user ? "bg-[url('/images/hero-bg-2.png')]  md:min-h-[450px] relative" : "bg-[url('/images/hero-bg.png')] min-h-screen"} flex items-center justify-start bg-cover bg-center`}
            >
                {user ? (
                    <>
                        <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-stretch min-h-[450px] w-full">
                            <div className="w-full md:w-2/5 flex md:py-40 pt-40 pb-20 items-center relative z-10">
                                <div className="flex flex-col items-start w-full">
                                    <h1 className="text-2xl md:text-3xl max-w-2xl md:max-w-none font-bold text-white mb-6 leading-tight">
                                        DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                                    </h1>
                                    <p className="text-base text-start md:text-lg max-w-xl md:max-w-none text-white/90 mb-8">
                                        Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                                        established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                                    </p>
                                </div>
                            </div>

                            <div className="md:block hidden absolute top-0 right-0 w-3/5 h-full">
                                <img src={processImageUrl("/images/banner-right.png")} alt="Banner Right" className="absolute bottom-0 right-0 w-full object-cover object-right" />
                            </div>
                        </div>
                    </>
                ) : (
                    <LayoutWrapper>
                        <div className="flex py-24 md:12 lg:0 items-center  justify-start">
                            <div className="flex flex-col items-start justify-start">
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                    DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                                </h1>
                                <p className="text-lg text-white/90 mb-8 max-w-4xl">
                                    Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                                    established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                                </p>
                                <div className="flex py-4 md:py-0 flex-col sm:flex-row gap-4">
                                    <img
                                        src={processImageUrl("/images/app-store.png")}
                                        alt="Download on App Store"
                                        className="h-auto md:h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                    <img
                                        src={processImageUrl("/images/googleplay.png")}
                                        alt="Get it on Google Play"
                                        className="h-auto md:h-14 cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                </div>
                            </div>
                        </div>
                    </LayoutWrapper>
                )}
            </section> */}
        </>
    )
}
