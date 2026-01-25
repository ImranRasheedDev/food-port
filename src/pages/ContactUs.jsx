import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        window.helper.sweetAlert("success", "Message Sent", "We'll get back to you soon!");
        setFormData({ email: "", name: "", message: "" });
    };

    return (
        <>
            <div className="h-[72px]" />
            {/* Banner Section */}
            <section className="bg-gradient-to-r from-[#d6071b] to-[#ff4d4d] h-[250px] sm:h-[364px] relative flex items-center justify-start overflow-hidden">
                {/* Food images on the right */}
                <div className="absolute right-0 bottom-0 h-full hidden lg:flex items-end">
                    <img
                        src={processImageUrl("/images/contact-banner.png")}
                        className="h-full object-cover"
                        alt="Food images"
                    />
                </div>

                {/* Text content */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full px-4 sm:px-6 md:px-8">
                    <div className="max-w-[1280px] mx-auto">
                        <div>
                            <h1 className="lg:text-5xl text-2xl font-semibold text-white mb-4 leading-tight uppercase font-poppins">
                                Contact Us
                            </h1>
                            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-[500px]">
                                Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                                established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chat with us Form Section */}
            <section className="py-12 sm:py-16">
                <LayoutWrapper>
                    <div className="bg-[#f8fafc] rounded p-6 sm:p-12 max-w-[1280px] mx-auto">
                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-[#191c1f] mb-3">
                                Chat with us
                            </h2>
                            <p className="text-[#475156] text-base leading-relaxed">
                                Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed molestie accumsan dui, non iaculis primis in faucibu raesent eget sem purus.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className="w-full h-[44px] px-4 bg-white border border-[#e4e7e9] rounded-sm text-sm text-[#191c1f] placeholder:text-[#77878f] focus:outline-none focus:border-primary-50"
                                required
                            />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full h-[44px] px-4 bg-white border border-[#e4e7e9] rounded-sm text-sm text-[#191c1f] placeholder:text-[#77878f] focus:outline-none focus:border-primary-50"
                                required
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Message"
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-[#e4e7e9] rounded-sm text-sm text-[#191c1f] placeholder:text-[#77878f] focus:outline-none focus:border-primary-50 resize-none"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full h-[48px] bg-primary-50 text-white font-bold text-sm uppercase tracking-wide rounded-sm flex items-center justify-center gap-2 transition-colors mt-4"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}

