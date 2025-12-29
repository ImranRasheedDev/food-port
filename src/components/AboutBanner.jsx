import LayoutWrapper from "./layoutWrapper";
import { processImageUrl } from '@/lib/utils';

/**
 * AboutBanner - A reusable banner component with gradient background
 * @param {string} title - The main heading text
 * @param {string} description - The description text below the title
 * @param {string} image - The image source URL
 * @param {string} imageAlt - Alt text for the image
 * @param {string} className - Additional CSS classes for customization
 */
export default function AboutBanner({
    title = "ABOUT FOOD PORT",
    description = "Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with established players. They needed to attract the hungry foodies, restaurant and food truck owners.",
    image = "/images/about-banner.png",
    imageAlt = "About Food Port",
    className = ""
}) {
    return (
        <section
            className={`relative overflow-hidden ${className}`}
            style={{
                background: `linear-gradient(0deg, rgba(255, 0, 0, 0.26), rgba(255, 0, 0, 0.26)),
                            linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12))`
            }}
        >
            <LayoutWrapper className="py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                    {/* Left side - Title and Description */}
                    <div className="order-2 lg:order-1 z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                            {title}
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Right side - Image */}
                    <div className="order-1 lg:order-2 relative flex items-center justify-center lg:justify-end">
                        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                            <img
                                src={processImageUrl(image)}
                                alt={imageAlt}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </LayoutWrapper>
        </section>
    );
}

