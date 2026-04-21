"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TestimonialCard from "../Cards/TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import LayoutWrapper from "../layoutWrapper";

const testimonials = [
    {
        name: "Restaurant Owner",
        role: "Restaurant Owner",
        text: "\"FoodPort has completely changed how we manage suppliers and daily operations. Everything is more organized, faster, and easier to track.\"",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Food Truck Operator",
        role: "Food Truck Operator",
        text: "\"As a food truck, staying connected on the move is critical. FoodPort helps us manage vendors and communication without slowing us down.\"",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Food Supplier",
        role: "Food Supplier",
        text: "\"The platform gave us better visibility and smoother coordination with our restaurant partners. It's a real game changer for suppliers.\"",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Brand Advertiser",
        role: "Brand Advertiser",
        text: "\"Advertising through FoodPort puts our brand directly in front of food businesses that matter. The engagement feels genuine and targeted.\"",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Distribution Partner",
        role: "Distribution Partner",
        text: "\"What stands out most is how simple everything feels. FoodPort actually understands how the food industry works.\"",
        avatar: "/images/bg-otp.jpg",
    },
];

export default function TestimonialsSection() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-32 bg-[url(/images/bg-testimonials.png)] bg-no-repeat bg-cover">
                <LayoutWrapper>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                    {/* Left side - Content */}
                    <div className="text-white col-span-1">
                        <h2 className="text-2xl md:text-4xl font-bold mb-6 leading-normal">
                            What Are People <br /> Saying About Us
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            We are very happy if you are satisfied with our <br /> service and
                            products, let's read pure reviews from customers
                        </p>

                        {/* Slider controls */}
                        <div className="">
                            <div className="text-6xl font-bold mb-8">
                                {String(activeIndex + 1).padStart(2, '0')}<span className="text-2xl text-primary-600"> / {String(testimonials.length).padStart(2, '0')}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="w-14 h-14 bg-white rounded-lg flex items-center justify-center cursor-pointer"
                                >
                                    <ArrowLeft className="w-6 h-6 text-primary-50" />
                                </button>
                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="w-14 h-14 bg-white rounded-lg flex items-center justify-center cursor-pointer"
                                >
                                    <ArrowRight className="w-6 h-6 text-primary-50" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Testimonials */}
                    <div className="relative col-span-2">
                        <Swiper
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            slidesPerView={1}
                            spaceBetween={10}
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                            }}
                            className="mySwiper"
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide
                                    key={index}

                                >
                                    <TestimonialCard
                                        activeIndex={activeIndex}
                                        index={index}
                                        role={testimonial.role}
                                        avatar={testimonial.avatar}
                                        name={testimonial.name}
                                        text={testimonial.text}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                </LayoutWrapper>
        </section>
    );
}
