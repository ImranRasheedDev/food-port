import React, { useRef } from 'react'
import { RestaurantCard } from '../Cards/PrimaryCard'
import SectionInfo from './SectionInfo'
import DealDiscountCard from '../Cards/DealDiscountCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { dealsAndDiscounts, restaurants } from '../MockData'

const DealsAndDiscounts = () => {
    const swiperRef = useRef(null);
    return (
        <div>
            <SectionInfo title={"Deals & Discounts"} description={"We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."} />
            <div className="relative mb-14">
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
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    className="mySwiper">
                    {
                        dealsAndDiscounts.map((deal, index) => (
                            <SwiperSlide key={index}>
                                <DealDiscountCard title={deal.title} companyName={deal.companyName} link={deal.link} image={deal.image} cardIndex={index} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <div className="flex space-x-2 absolute top-1/2 -translate-y-1/2 w-full justify-between z-10">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-10 h-10 relative -left-6 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer border border-primary-1010"
                    >
                        <ArrowLeft className="w-6 h-6 text-primary-100" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-10 h-10 relative -right-6 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer border border-primary-1010"
                    >
                        <ArrowRight className="w-6 h-6 text-primary-100" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {restaurants.slice(0, 6).map((restaurant, index) => (
                    <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                ))}
            </div>
        </div>
    )
}

export default DealsAndDiscounts