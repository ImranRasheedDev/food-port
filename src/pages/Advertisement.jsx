import {
  HowItWorksSection,
  BusinessOwnerSection,
  IndividualSection,
  GetStartedSection,
} from "@/components/advertisement";

export default function Advertisement() {
  return (
    <>
      <div className="h-[72px]" />
      <section
        className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-start bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/advertisement.jpg')",
        }}
      >
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-[1280px] mx-auto">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight uppercase">
                Grow Your Business <br /> With Food Port Ads
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white mb-8 leading-relaxed max-w-3xl">
                Reach thousands of hungry customers in your area. Whether you own a restaurant, food truck, or want to
                promote a food-related business, our advertising platform helps you connect with the right audience.
              </p>
              <a
                href={`https://myfoodport.com/ad_campaign?user=${window.user?.user_id || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#f15a24] hover:bg-[#d14a1a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                View your ads
              </a>
            </div>
          </div>
        </div>
      </section>
      <HowItWorksSection />
      <BusinessOwnerSection />
      <IndividualSection />
      <GetStartedSection />
    </>
  );
}
