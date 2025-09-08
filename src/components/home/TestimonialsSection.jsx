"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TestimonialCard from "../Cards/TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    {
        name: "Selena Gomz",
        age: "22 Years",
        text: "“Fresh Feast has truly revolutionized my approach to eating healthy! Their diverse menu options make it easy to find something delicious and nutritious every time”",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "David Ken",
        age: "24 Years",
        text: "“Fresh Feast has truly revolutionized my approach to eating healthy! Their diverse menu options make it easy to find something delicious and nutritious every time”",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Jennifer Sina",
        age: "21 Years",
        text: "“Fresh Feast has truly revolutionized my approach to eating healthy! Their diverse menu options make it easy to find something delicious and nutritious every time”",
        avatar: "/images/bg-otp.jpg",
    },
    {
        name: "Jennifer Sina",
        age: "21 Years",
        text: "“Fresh Feast has truly revolutionized my approach to eating healthy! Their diverse menu options make it easy to find something delicious and nutritious every time”",
        avatar: "/images/bg-otp.jpg",
    },
];

export default function TestimonialsSection() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-32 bg-[url(/images/bg-testimonials.png)] bg-no-repeat bg-cover">
            <div className="container mx-auto px-4">
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
                                02<span className="text-2xl text-primary-600"> / 05</span>
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
                                        age={testimonial.age}
                                        avatar={testimonial.avatar}
                                        name={testimonial.name}
                                        text={testimonial.text}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}
