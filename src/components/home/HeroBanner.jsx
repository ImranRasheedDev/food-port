export default function HeroBanner() {
    return (
        <section
            className="relative min-h-screen flex items-center justify-start bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/delicious-food-background-with-burgers-and-fries.png')`,
            }}
        >
            <div className="container mx-auto px-4 pt-20">
                <div className="max-w-5xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        DISCOVER FLAVOURS FROM TOP RESTAURANTS & FOOD TRUCK
                    </h1>
                    <p className="text-lg text-white/90 mb-8 max-w-4xl">
                        Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                        established players. They needed to attract the hungry foodies, restaurant and food truck owners.
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
        </section>
    )
}
