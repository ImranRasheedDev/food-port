import React, { useRef } from 'react'
import AdviserCard from '../Cards/AdviserCard'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBannerAds } from '../../hooks/api/useAds';

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
    const { data, isLoading } = useBannerAds();
    const campaigns = Array.isArray(data?.data) ? data.data : [];
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
                        {isLoading && (
                            Array.from({ length: 2 }).map((_, index) => (
                                <SwiperSlide key={`skeleton-${index}`}>
                                    <div className="bg-primary-1003 flex gap-x-10 text-white rounded-4xl items-center animate-pulse">
                                        <div className='pl-10 py-10 w-3/5'>
                                            <div className='h-8 w-3/4 bg-white/30 rounded mb-4'></div>
                                            <div className='h-4 w-full bg-white/20 rounded mb-2'></div>
                                            <div className='h-4 w-5/6 bg-white/20 rounded mb-6'></div>
                                            <div className='h-10 w-36 bg-white/40 rounded-4xl'></div>
                                        </div>
                                        <div className='ml-auto ronded-tr-4xl rounded-br-4xl w-2/5 flex justify-end'>
                                            <div className='ronded-tr-4xl rounded-br-4xl block bg-white/30 w-full h-60'></div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                        {
                            (!isLoading ? campaigns : []).map((campaign, index) => (
                                <SwiperSlide key={campaign?.id ?? index}>
                                    <AdviserCard
                                        index={index}
                                        title={campaign?.product?.name || "Make Your First Order and Get 25% Off From"}
                                        companyName={campaign?.product?.restaurant_id || "Pizzucci"}
                                        description={"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."}
                                        link={campaign?.product?.restaurant_id ? `/resturants-detail/${campaign.product.restaurant_id}` : '#'}
                                        mediaPath={campaign?.media_path}
                                    />
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