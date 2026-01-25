import LayoutWrapper from "@/components/layoutWrapper";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "./FAQ";
import { Users, Truck, Package, Megaphone, Settings } from "lucide-react";

export default function BecomePartner() {
    const whyPartnerPoints = [
        {
            title: "A Network Built for Growth",
            description: "Join a powerful community of food service professionals, suppliers, and advertisers who trust FoodPort to streamline operations, strengthen relationships, and expand visibility."
        },
        {
            title: "Designed for Restaurants, Food Trucks & Beyond",
            description: "We understand the unique demands of both mobile food businesses and stationary kitchens. Our solutions support daily operations, marketing, and logistics — wherever and however you serve your customers."
        },
        {
            title: "Visibility for Advertisers",
            description: "FoodPort is more than a platform — it's a stage for brands. Advertisers can connect directly with a passionate, food-focused audience, gaining real exposure and measurable engagement through our growing network."
        },
        {
            title: "Smart, Scalable Solutions",
            description: "We combine modern technology with industry expertise to help you manage, market, and grow your business efficiently and sustainably."
        }
    ];

    const partnerTypes = [
        {
            icon: Users,
            type: "Restaurants",
            description: "Simplify sourcing, operations, and business management."
        },
        {
            icon: Truck,
            type: "Food Trucks",
            description: "Stay connected and organized with tools designed for mobility."
        },
        {
            icon: Package,
            type: "Suppliers & Distributors",
            description: "Expand your reach through streamlined logistics and increased visibility."
        },
        {
            icon: Megaphone,
            type: "Advertisers",
            description: "Engage directly with businesses and consumers across the FoodPort network."
        },
        {
            icon: Settings,
            type: "Service & Tech Partners",
            description: "Collaborate on solutions that drive innovation and sustainability across the food industry."
        }
    ];

    return (
        <>
            <div className="h-[72px]" />
            {/* Banner Section */}
            <section
                className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-start bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/become-a-partner.jpg')",
                }}
            >
                {/* Dark overlay to make text readable */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="max-w-[1280px] mx-auto">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight uppercase">
                                PARTNER WITH A PLATFORM THAT<br />
                                CONNECTS THE ENTIRE FOOD INDUSTRY
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-white mb-8 leading-relaxed max-w-3xl">
                                Join FoodPort to collaborate with restaurants, food trucks, suppliers, distributors, and advertisers through one integrated platform designed to simplify operations, strengthen partnerships, and create sustainable growth opportunities across the food industry.
                            </p>

                            {/* Call-to-Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    target="_blank"
                                    to="https://myfoodport.com/login"
                                    className="px-12 py-3 bg-primary-50 text-white font-medium rounded-full hover:bg-primary-50/90 transition-colors"
                                >
                                    Register
                                </Link>
                                <Link
                                    target="_blank"
                                    to="https://myfoodport.com/register"
                                    className="px-12 py-3 bg-white text-primary-50 font-medium rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Partner With FoodPort Section */}
            <section className="py-16">
                <LayoutWrapper>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary-400 mb-4">
                            Why Partner With <span className="text-primary-50">FoodPort?</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {whyPartnerPoints.map((point, index) => (
                            <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-semibold text-primary-900 mb-4">{point.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </LayoutWrapper>
            </section>

            {/* Who We Partner With Section */}
            <section className="py-16 bg-slate-50">
                <LayoutWrapper>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary-400 mb-4">
                            Who We <span className="text-primary-50">Partner With</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {partnerTypes.map((partner, index) => {
                            const IconComponent = partner.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                                    <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary-900 mb-2">{partner.type}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{partner.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </LayoutWrapper>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <LayoutWrapper>
                    <h3 className="text-2xl font-semibold text-primary-900 mb-6">
                        Frequently Asked Questions
                    </h3>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id} className="mb-6 last:mb-0">
                                <AccordionTrigger className="font-semibold">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </LayoutWrapper>
            </section>

            {/* Join the Movement Section */}
            <section className="py-16 bg-primary-50">
                <LayoutWrapper>
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Join the Movement
                        </h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                            Together, we're reimagining how the food industry connects, collaborates, and thrives. Partner with FoodPort today and let's move the future of food forward.
                        </p>
                        <Link
                            to="/auth/signup"
                            className="inline-block px-12 py-4 bg-white text-primary-50 font-semibold rounded-full hover:bg-gray-100 transition-colors"
                        >
                            Become a Partner →
                        </Link>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}
