import LayoutWrapper from "../layoutWrapper";
import { processImageUrl } from "@/lib/utils";

export default function AppSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <LayoutWrapper>
        <div className="bg-[url(/images/app-bg.png)] bg-no-repeat bg-cover rounded-md md:h-[400px] lg:h-[400px] py-4 md:py-0 flex justify-center items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center px-4 sm:px-6">
            {/* Left side - Phone mockup */}
            <div className="relative flex items-center justify-center h-full order-2 lg:order-1">
              <div className="relative">
                <img
                  src={processImageUrl("/images/app-ad-left.png")}
                  alt="Food Port Mobile App"
                  className="w-auto h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover object-left-bottom"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="text-white text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 leading-normal">
                Get Started With Fresh <br className="hidden sm:block" /> Feast
                Today!
              </h2>
              <p className="text-sm sm:text-base md:text-md mb-4 sm:mb-6 opacity-90 leading-relaxed">
                It's never been easier to order food. Look for the finest
                discounts and you'll <br className="hidden sm:block" /> be lost
                in a world of delectable food.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <img
                  src={processImageUrl("/images/app-store.png")}
                  alt="Download on App Store"
                  className="h-12 sm:h-14 cursor-pointer hover:opacity-80 transition-opacity mx-auto sm:mx-0"
                />
                <img
                  src={processImageUrl("/images/googleplay.png")}
                  alt="Get it on Google Play"
                  className="h-12 sm:h-14 cursor-pointer hover:opacity-80 transition-opacity mx-auto sm:mx-0"
                />
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
