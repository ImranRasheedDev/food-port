import React, { useRef } from 'react'
import { RestaurantCard } from '../Cards/PrimaryCard'
import SectionInfo from './SectionInfo'
import DealDiscountCard from '../Cards/DealDiscountCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react'
const restaurants = [
    {
        name: "KFC",
        description: "Chicken quesadilla, avocado...",
        rating: 3.2,
        image: "/images/popular-1.png",
        location: "California",
        distance: "1 km",
        time: "30 min",
    },
    {
        name: "Poultry Palace",
        description: "Chicken quesadilla, avocado...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "New Jersey",
        distance: "3.2 km",
        time: "25 min",
    },
    {
        name: "The Grill Master's Cafe",
        description: "Bread, Eggs, Butter, Fries...",
        rating: 4.3,
        image: "/images/popular-1.png",
        location: "New York",
        distance: "5 km",
        time: "40 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
    {
        name: "KFC",
        description: "Chicken quesadilla, avocado...",
        rating: 3.2,
        image: "/images/popular-1.png",
        location: "California",
        distance: "1 km",
        time: "30 min",
    },
    {
        name: "Poultry Palace",
        description: "Chicken quesadilla, avocado...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "New Jersey",
        distance: "3.2 km",
        time: "25 min",
    },
    {
        name: "The Grill Master's Cafe",
        description: "Bread, Eggs, Butter, Fries...",
        rating: 4.3,
        image: "/images/popular-1.png",
        location: "New York",
        distance: "5 km",
        time: "40 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
]
const DealsAndDiscounts = () => {
    const swiperRef = useRef(null);
    return (
        <div>
            <SectionInfo title={"Deals & Discounts"} description={"We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."} />
            <div className="relative">
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
                    <SwiperSlide>
                        <DealDiscountCard title="Make Your First Order and Get 25% Off From" companyName="Restaurant Name" link="" image="/images/deals-12.png" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <DealDiscountCard title="Make Your First Order and Get 25% Off From" companyName="Restaurant Name" link="" image="/images/deals-12.png" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <DealDiscountCard title="Make Your First Order and Get 25% Off From" companyName="Restaurant Name" link="" image="/images/deals-12.png" />
                    </SwiperSlide>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {restaurants.slice(0, 6).map((restaurant, index) => (
                    <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                ))}
            </div>
        </div>
    )
}

export default DealsAndDiscounts