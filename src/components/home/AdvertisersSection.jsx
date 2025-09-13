import React, { useRef } from 'react'
import AdviserCard from '../Cards/AdviserCard'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const AdvisersData = [
    {
        title: "Make Your First Order and Get 25% Off From",
        companyName: "Pizzucci",
        description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
        link: "",
    },
    {
        title: "Make Your First Order and Get 25% Off From",
        companyName: "Pizzucci",
        description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
        link: "",
    },
    {
        title: "Make Your First Order and Get 25% Off From",
        companyName: "Pizzucci",
        description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
        link: "",
    },
    {
        title: "Make Your First Order and Get 25% Off From",
        companyName: "Pizzucci",
        description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
        link: "",
    },
]
const AdvertisersSection = () => {
    const swiperRef = useRef(null);
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Top <span className="text-primary-50">Advertisers</span> Pick
                </h2>

                <p className="text-gray-600 mb-10">We're committed to cook healthy to ensure they retain their freshness and <br /> nutritional value, guaranteeing a delightful experience.</p>
                <div className='relative'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 2,
                                spaceBetween: 40,
                            },
                        }}
                        className="mySwiper"
                    >
                        {
                            AdvisersData.map((adviser, index) => (
                                <SwiperSlide key={index}>
                                    <AdviserCard index={index} title={adviser.title} companyName={adviser.companyName} description={adviser.description} link={adviser.link} />
                                </SwiperSlide>
                            ))
                        }

                    </Swiper>
                    <div className="flex space-x-2 absolute top-1/2 -translate-y-1/2 w-full justify-between z-10">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-14 h-14 relative -left-7 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <ArrowLeft className="w-6 h-6 text-primary-100" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-14 h-14 relative -right-7 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <ArrowRight className="w-6 h-6 text-primary-100" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdvertisersSection