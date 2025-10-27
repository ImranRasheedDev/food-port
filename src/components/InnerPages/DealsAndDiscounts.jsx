import React, { useRef } from "react";
import { RestaurantCard } from "../Cards/PrimaryCard";
import SectionInfo from "./SectionInfo";
import DealDiscountCard from "../Cards/DealDiscountCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dealsAndDiscounts, restaurants } from "../MockData";

const DealsAndDiscounts = ({
  restaurants = [],
  isLoading = false,
  hasApiData = false,
  apiReturnedEmpty = false,
  hideRestaurantCards = false,
}) => {
  const swiperRef = useRef(null);

  // Static sample data for fallback
  const sampleRestaurants = [
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
      name: "Pizza Palace",
      description: "Fresh pizza, pasta, salads...",
      rating: 4.1,
      image: "/images/popular-1.png",
      location: "Chicago",
      distance: "2.5 km",
      time: "35 min",
    },
    {
      name: "Burger Joint",
      description: "Gourmet burgers, fries, shakes...",
      rating: 3.9,
      image: "/images/popular-1.png",
      location: "Boston",
      distance: "1.8 km",
      time: "25 min",
    },
  ];

  return (
    <div>
      <SectionInfo
        title={"Deals & Discounts"}
        description={
          "We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."
        }
      />
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
          className="mySwiper"
        >
          {dealsAndDiscounts.map((deal, index) => (
            <SwiperSlide key={index}>
              <DealDiscountCard
                title={deal.title}
                companyName={deal.companyName}
                link={deal.link}
                image={deal.image}
                cardIndex={index}
              />
            </SwiperSlide>
          ))}
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

      {!hideRestaurantCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))
          ) : hasApiData && restaurants.length > 0 ? (
            restaurants
              .slice(0, 6)
              .map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.key || index}
                  description={restaurant.description}
                  distance={restaurant.distance}
                  image={restaurant.image}
                  location={restaurant.location}
                  name={restaurant.name}
                  onFavoriteClick={restaurant.onFavoriteClick || (() => {})}
                  rating={restaurant.rating}
                  time={restaurant.time}
                  isLiked={restaurant.isLiked || false}
                  restaurantId={restaurant.key || index}
                  link={
                    restaurant.link ||
                    `/resturants-detail/${restaurant.key || index}`
                  }
                />
              ))
          ) : apiReturnedEmpty ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No more restaurants available</p>
            </div>
          ) : (
            sampleRestaurants
              .slice(0, 6)
              .map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  description={restaurant.description}
                  distance={restaurant.distance}
                  image={restaurant.image}
                  location={restaurant.location}
                  name={restaurant.name}
                  onFavoriteClick={() => {}}
                  rating={restaurant.rating}
                  time={restaurant.time}
                  isLiked={false}
                  restaurantId={index + 1}
                  link={`/resturants-detail/${index + 1}`}
                />
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default DealsAndDiscounts;
