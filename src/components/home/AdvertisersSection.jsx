import React, { useRef, useState } from 'react'
import AdviserCard from '../Cards/AdviserCard'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBannerAds } from '../../hooks/api/useAds';
import LayoutWrapper from '../layoutWrapper';
// import Helper from '@/helpers';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../InnerPages/ProductModal';

// const AdvisersData = [
//     {
//         title: "Make Your First Order and Get 25% Off From",
//         companyName: "Pizzucci",
//         description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
//         link: "",
//     },
//     {
//         title: "Make Your First Order and Get 25% Off From",
//         companyName: "Pizzucci",
//         description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
//         link: "",
//     },
//     {
//         title: "Make Your First Order and Get 25% Off From",
//         companyName: "Pizzucci",
//         description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
//         link: "",
//     },
//     {
//         title: "Make Your First Order and Get 25% Off From",
//         companyName: "Pizzucci",
//         description: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without.",
//         link: "",
//     },
// ]
const AdvertisersSection = () => {
    const swiperRef = useRef(null);
    const { data, isLoading } = useBannerAds();
    const campaigns = Array.isArray(data?.data) ? data.data : [];
    const navigate = useNavigate();
    console.log(campaigns, 'campaigns');

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const handleCardClick = async (campaign) => {
        const restaurantId = campaign?.restaurant?.id;
        const restaurantName = campaign?.restaurant?.name;
        const productId = campaign?.product?.id;

        // Priority: restaurant first
        if (restaurantId && productId) {
            navigate(`/resturants-detail/${restaurantId}`, { state: { productId } });
            return;
        }

        if (restaurantId && !productId) {
            navigate(`/resturants-detail/${restaurantId}`);
            return;
        }

        if (!restaurantId && productId) {
            setSelectedProductId(productId);
            setSelectedRestaurant(null);
            setIsProductModalOpen(true);
            return;
        }
    };
    return (
        <section className="py-16 bg-white">
            <LayoutWrapper>
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
                                    <div className="bg-primary-1003 flex flex-col md:flex-row gap-x-10 gap-y-5 text-white rounded-4xl items-center animate-pulse">
                                        <div className='pl-4 md:pl-10 py-6 md:py-10 w-full md:w-3/5'>
                                            <div className='h-6 md:h-8 w-3/4 bg-white/30 rounded mb-4'></div>
                                            <div className='h-3 md:h-4 w-full bg-white/20 rounded mb-2'></div>
                                            <div className='h-3 md:h-4 w-5/6 bg-white/20 rounded mb-6'></div>
                                            <div className='h-8 md:h-10 w-32 md:w-36 bg-white/40 rounded-4xl'></div>
                                        </div>
                                        <div className='w-full md:w-2/5 flex justify-center md:justify-end md:ml-auto'>
                                            <div className='rounded-b-4xl md:ronded-tr-4xl md:rounded-br-4xl block bg-white/30 w-full max-w-sm md:max-w-none h-48 md:h-60'></div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        )}
                        {
                            (!isLoading ? campaigns : []).map((campaign, index) => (
                                <SwiperSlide key={campaign?.id ?? index}>
                                    {/* <AdviserCard
                                         index={index}
                                         title={`Make Your First Order and Get 25% Off From`}
                                         companyName={"Restaurant"}
                                         description={"In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."}
                                         link={campaign?.restaurant?.id && campaign?.product?.id ? `/resturants-detail/${campaign.restaurant.id}` : '#'}
                                         mediaPath={campaign?.media_path}
                                         onClick={() => handleCardClick(campaign)}
                                    /> */}
                                    <div onClick={() => handleCardClick(campaign)} className='cursor-pointer rounded-4xl overflow-hidden h-48 md:h-64'>
                                        <img src={campaign?.media_path} alt={campaign?.restaurant?.name} className='w-full h-full object-cover' />
                                    </div>
                                    {/* <div onClick={() => handleCardClick(campaign)}>
                                        <img src={campaign?.media_path} alt={campaign?.restaurant?.name} className='w-full h-full object-cover' />
                                    </div> */}
                                </SwiperSlide>
                            ))
                        }

                    </Swiper>
                    {/* <div className="flex space-x-2 absolute top-1/2 -translate-y-1/2 w-full justify-between z-10"> */}
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-10 h-10 md:w-14 md:h-14 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer absolute top-1/2 -translate-y-1/2 left-0 md:left-0 z-10"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-6 md:h-6 text-primary-100" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-10 h-10 md:w-14 md:h-14 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer absolute top-1/2 -translate-y-1/2 right-0 md:right-0 z-10"
                    >
                        <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-primary-100" />
                    </button>
                    {/* </div> */}
                </div>
                <ProductModal
                    open={isProductModalOpen}
                    setOpen={setIsProductModalOpen}
                    productId={selectedProductId}
                    restaurantData={selectedRestaurant}
                />
            </LayoutWrapper>
        </section>
    )
}

export default AdvertisersSection