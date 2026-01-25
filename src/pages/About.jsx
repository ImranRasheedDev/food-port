import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { Heart, Lightbulb, Handshake, Leaf } from "lucide-react";

function About() {
    const values = [
        {
            icon: Heart,
            title: "Passion for Food",
            description: "We're inspired by the people who create, serve, and share food — and we're committed to supporting their success."
        },
        {
            icon: Lightbulb,
            title: "Innovation That Simplifies",
            description: "We design practical solutions that make complex processes easier to manage and scale."
        },
        {
            icon: Handshake,
            title: "Partnership & Trust",
            description: "We believe collaboration drives progress — and every partnership strengthens the FoodPort network."
        },
        {
            icon: Leaf,
            title: "Sustainability & Responsibility",
            description: "We champion smarter business practices that reduce waste and support a more responsible future for the industry."
        }
    ];

    return (
        <>
            <div className="h-[72px]" />
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
                                About FoodPort
                            </h1>
                            <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Reshaping the way the food industry operates through smarter, more connected systems.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16">
                <LayoutWrapper>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-primary-400 mb-8">
                                Our <span className="text-primary-50">Story</span>
                            </h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Founded with a passion for food and a vision for innovation, FoodPort was built to simplify operations for food businesses of all sizes. What began as an idea to help restaurants manage logistics has evolved into a full-service digital hub that unites every part of the food supply chain.
                                </p>
                                <p>
                                    Every day, we help our partners overcome operational challenges through accessible tools, real-time insights, and smart collaboration — allowing them to focus on what truly matters: delivering great food and unforgettable experiences.
                                </p>
                            </div>
                        </div>
                        <div>
                            <img src={processImageUrl("/images/about-page-rigth.png")} alt="About FoodPort" className="w-full rounded-lg" />
                        </div>
                    </div>
                </LayoutWrapper>
            </section>

            {/* Our Vision Section */}
            <section className="py-16 bg-slate-50">
                <LayoutWrapper>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-primary-400 mb-8">
                            Our <span className="text-primary-50">Vision</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            To build the leading all-in-one platform where food businesses — from local food trucks to global suppliers — can operate seamlessly, connect meaningfully, and grow sustainably.
                        </p>
                    </div>
                </LayoutWrapper>
            </section>

            {/* Our Mission Section */}
            <section className="py-16">
                <LayoutWrapper>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-primary-400 mb-8">
                            Our <span className="text-primary-50">Mission</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            To empower the entire food ecosystem with innovative technology, transparent communication, and data-driven solutions that make running a food business simpler and more rewarding.
                        </p>
                    </div>
                </LayoutWrapper>
            </section>

            {/* What We Stand For Section */}
            <section className="py-16 bg-slate-50">
                <LayoutWrapper>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary-400">
                            What We <span className="text-primary-50">Stand For</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const IconComponent = value.icon;
                            return (
                                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-primary-900 mb-4">{value.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </LayoutWrapper>
            </section>

            {/* Your Gateway Section */}
            <section className="py-16">
                <LayoutWrapper>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-primary-400 mb-8">
                            Your Gateway to <span className="text-primary-50">Smarter Food Operations</span>
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            No matter your role — restaurant owner, food truck operator, supplier, or advertiser — FoodPort is the place where your business connects, grows, and thrives.
                        </p>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}

export default About;
