import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const faqs = [
    {
        id: "item-1",
        question: "How do I place an order?",
        answer: "To place an order, simply browse our restaurant and food truck options, select your favorite dishes, add them to your cart, and proceed to checkout. You can pay using various payment methods including credit cards and digital wallets.",
    },
    {
        id: "item-2",
        question: "What are the delivery charges?",
        answer: "Delivery charges vary depending on your location and the restaurant you're ordering from. The delivery fee will be displayed before you confirm your order. Some restaurants may offer free delivery for orders above a certain amount.",
    },
    {
        id: "item-3",
        question: "How long does delivery take?",
        answer: "Delivery times typically range from 30-60 minutes, depending on your location, the restaurant's preparation time, and current order volume. You can track your order in real-time through our app.",
    },
    {
        id: "item-4",
        question: "Can I cancel my order?",
        answer: "You can cancel your order if it hasn't been confirmed by the restaurant yet. Once confirmed, cancellation may not be possible. If you need to cancel, please contact our customer support immediately.",
    },
    {
        id: "item-5",
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit cards, debit cards, digital wallets, and cash on delivery (where available). All online transactions are secure and encrypted.",
    },
    {
        id: "item-6",
        question: "How can I track my order?",
        answer: "Once your order is confirmed, you'll receive a tracking link. You can also track your order directly in the app or on our website by entering your order number. Real-time updates will be sent to your registered phone number.",
    },
];

export default function FAQ() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        // TODO: Implement form submission logic
        // You can add API call here to send the message
        alert("Thank you for your message! We'll get back to you soon.");
        reset();
    };

    return (
        <>
            <div className="h-[72px]" />
            {/* First Section - Banner same as PrivacyPolicy */}
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
                                Frequently Asked Questions
                            </h1>
                            <p className="text-sm sm:text-base  text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with <br />
                                established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Second Section - Title and Description Centered */}
            <section className="py-16">
                <LayoutWrapper>

                    {/* Third Section - Grid with FAQs and Contact Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - FAQs Accordion */}
                        <div>
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
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="bg-primary-1025 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-primary-900 mb-4">
                                Don't find your answer, Ask for support.
                            </h3>
                            <p className="text-primary-900 mb-6 leading-relaxed">
                                Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis primis in faucibu raesent eget sem purus.
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-white border  rounded-none h-11 px-4 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 border-primary-50 focus-within:shadow-none focus:shadow-none shadow-none!"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600" role="alert">
                                        {errors.email.message}
                                    </p>
                                )}

                                <Input
                                    id="subject"
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full bg-white border  rounded-none h-11 px-4 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 border-primary-50 focus-within:shadow-none focus:shadow-none shadow-none!"
                                    {...register("subject", {
                                        required: "Subject is required",
                                        minLength: {
                                            value: 3,
                                            message: "Subject must be at least 3 characters",
                                        },
                                    })}
                                    aria-invalid={errors.subject ? "true" : "false"}
                                />
                                {errors.subject && (
                                    <p className="text-sm text-red-600" role="alert">
                                        {errors.subject.message}
                                    </p>
                                )}

                                <Textarea
                                    id="message"
                                    placeholder="Message (Optional)"
                                    rows={6}
                                    className="w-full bg-white border  rounded-none h-11 px-4 focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-50 border-primary-50 focus-within:shadow-none focus:shadow-none shadow-none! resize-none"
                                    {...register("message", {
                                        minLength: {
                                            value: 10,
                                            message: "Message must be at least 10 characters",
                                        },
                                    })}
                                    aria-invalid={errors.message ? "true" : "false"}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-600" role="alert">
                                        {errors.message.message}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-primary-50 hover:bg-primary-50/90 text-white font-bold h-12 rounded-none uppercase "
                                >
                                    SEND MESSAGE
                                </Button>
                            </form>
                        </div>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}

