import LayoutWrapper from "../layoutWrapper";
export default function AppSection() {
    return (
        <section className="py-16 ">
             <LayoutWrapper>
            <div className=" mx-auto px-4 bg-[url(/images/app-bg.png)] bg-no-repeat bg-cover rounded-md h-[590px] flex justify-center items-center">
          
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Phone mockup */}
                    <div className="relative">
                        <div className="relative  mx-auto">
                            <img  src="/images/iphone-mockup-with-food-delivery-app-interface-sho.png" alt="Food Port Mobile App" className="w-full h-auto" />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-normal">Get Started With Fresh <br /> Feast Today!</h2>
                        <p className="text-lg mb-4 opacity-90">
                            It's never been easier to order food. Look for the finest discounts and you'll <br /> be lost in a world of delectable food.
                        </p>
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
                    </div>
                </div>
                
            </div>
            </LayoutWrapper>
        </section>
    )
}