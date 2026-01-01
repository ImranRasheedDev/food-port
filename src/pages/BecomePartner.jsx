import WhyChooseUs from "@/components/home/WhyChooseUs";
import LayoutWrapper from "@/components/layoutWrapper";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "./FAQ";

export default function BecomePartner() {
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
                                DISCOVER FLAVOURS FROM TOP<br />
                                RESTAURANTS & FOOD TRUCK
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-white mb-8 leading-relaxed">
                                Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with <br /> established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                            </p>

                            {/* Call-to-Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/auth/signup"
                                    className="px-12 py-3 bg-primary-50 text-white font-medium rounded-full"
                                >
                                    Register
                                </Link>
                                <Link
                                    to="/auth/login"
                                    className="px-12 py-3 bg-primary-50 text-white font-medium rounded-full"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <LayoutWrapper>
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-primary-400 mb-4">Become a restaurant or local shop partner</h2>
                        <p className="lg:w-1/2 mx-auto text-primary-1019">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes amet, consectetuer adipiscing elit. Aenean commodo
                        </p>
                    </div>
                </LayoutWrapper>
            </section>
            <WhyChooseUs />
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
        </>
    );
}