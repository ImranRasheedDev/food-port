import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
    const handleCallNow = () => {
        window.location.href = "tel:+1-202-555-0126";
    };

    const handleContactUs = () => {
        window.location.href = "mailto:info@foodport.com";
    };

    return (
        <>
            <div className="h-[72px]" />
            {/* First Section - Banner same as FAQ page */}
            <section
                className={`bg-[url('/images/hero-bg-2.png')] h-[250px] sm:h-[400px] md:h-[250px] relative flex items-center justify-start bg-cover bg-center`}
            >
                <div className="absolute bottom-0 right-0 ml-auto text-right hidden sm:block">
                    <img src={processImageUrl("/images/about-banner.png")} className="w-full h-full object-cover" alt="Inner Banner" />
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full px-4 sm:px-6 md:px-8">
                    <div className="max-w-[1280px] mx-auto">
                        <div>
                            <h1 className="lg:text-5xl text-2xl font-bold text-white mb-6 leading-tight uppercase">
                                Contact Us
                            </h1>
                            <p className="text-sm sm:text-base  text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with <br />
                                established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Second Section - Two Grid Cards */}
            <section className="py-16">
                <LayoutWrapper>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* First Card - Call us now */}
                        <div className="bg-white  shadow-md p-6 flex items-start gap-6">
                            {/* Left Side - Icon */}
                            <div className="bg-primary-1011 p-4 shrink-0 w-16 h-16 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        fill="#E59D00"
                                        d="M17.344 23.4a15.68 15.68 0 0 0 7.312 7.294 1.5 1.5 0 0 0 1.482-.113l4.687-3.13a1.48 1.48 0 0 1 1.425-.132l8.775 3.769a1.48 1.48 0 0 1 .9 1.556A9 9 0 0 1 33 40.5 25.5 25.5 0 0 1 7.5 15a9 9 0 0 1 7.856-8.925 1.48 1.48 0 0 1 1.557.9l3.768 8.794a1.5 1.5 0 0 1-.112 1.406l-3.131 4.763a1.5 1.5 0 0 0-.094 1.462"
                                        opacity="0.2"
                                    ></path>
                                    <path
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M17.344 23.4a15.68 15.68 0 0 0 7.312 7.294 1.5 1.5 0 0 0 1.482-.113l4.687-3.13a1.48 1.48 0 0 1 1.425-.132l8.775 3.769a1.48 1.48 0 0 1 .9 1.556A9 9 0 0 1 33 40.5 25.5 25.5 0 0 1 7.5 15a9 9 0 0 1 7.856-8.925 1.48 1.48 0 0 1 1.557.9l3.768 8.794a1.5 1.5 0 0 1-.112 1.406l-3.131 4.763a1.5 1.5 0 0 0-.094 1.462"
                                    ></path>
                                    <path fill="#E59D00" d="M29.888 7.5A15.02 15.02 0 0 1 40.5 18.113"></path>
                                    <path
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M29.888 7.5A15.02 15.02 0 0 1 40.5 18.113"
                                    ></path>
                                    <path fill="#2DA5F3" d="M28.331 13.294a8.98 8.98 0 0 1 6.375 6.375"></path>
                                    <path
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M28.331 13.294a8.98 8.98 0 0 1 6.375 6.375"
                                    ></path>
                                </svg>
                            </div>

                            {/* Right Side - Content */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                                    Call us now
                                </h3>
                                <p className="text-primary-1019 text-sm mb-1">
                                    we are available online from 9:00 AM to 5:00 PM
                                </p>
                                <p className="text-primary-1019 text-sm mb-4">
                                    (GMT95:45) Talk with use now
                                </p>
                                <p className="text-2xl font-normal text-primary-1008 mb-4">
                                    +1-202-555-0126
                                </p>
                                <button
                                    onClick={handleCallNow}
                                    className="bg-primary-1011 text-white flex items-center gap-2 px-8 h-12 rounded-none"
                                >
                                    Call Now
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>

                        {/* Second Card - Chat with us */}
                        <div className="bg-white rounded-lg shadow-md p-6 flex items-start gap-6">
                            {/* Left Side - Icon */}
                            <div className="bg-primary-1026 rounded-lg p-4 shrink-0 w-16 h-16 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        fill="#FFBFBB"
                                        d="M8.512 33.188a17.981 17.981 0 1 1 6.3 6.3L8.587 41.25a1.482 1.482 0 0 1-1.837-1.837z"
                                        opacity="0.2"
                                    ></path>
                                    <path
                                        stroke="#E6160A"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M8.512 33.188a17.981 17.981 0 1 1 6.3 6.3L8.587 41.25a1.482 1.482 0 0 1-1.837-1.837z"
                                    ></path>
                                    <path
                                        fill="#E6160A"
                                        d="M24 26.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5M15 26.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5M33 26.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5"
                                    ></path>
                                </svg>
                            </div>

                            {/* Right Side - Content */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary-900 mb-3">
                                    Chat with us
                                </h3>
                                <p className="text-primary-1019 text-sm mb-1">
                                    we are available online from 9:00 AM to 5:00 PM
                                </p>
                                <p className="text-primary-1019 text-sm mb-4">
                                    (GMT95:45) Talk with use now
                                </p>
                                <p className="text-2xl font-normal text-primary-1008 mb-4">
                                    info@foodport.com
                                </p>
                                <button
                                    onClick={handleContactUs}
                                    className="bg-primary-50 text-white flex items-center gap-2 px-8 h-12 rounded-none"
                                >
                                    Contact Us
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}

