import React, { useRef } from "react";
import { RestaurantCard } from "../Cards/PrimaryCard";
import SectionInfo from "./SectionInfo";
import DealDiscountCard from "../Cards/DealDiscountCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dealsAndDiscounts, restaurants } from "../MockData";
import { useBannerAds } from "@/hooks/api";

const DealsAndDiscounts = ({
  restaurants = [],
  isLoading = false,
  hasApiData = false,
  apiReturnedEmpty = false,
  hideRestaurantCards = false,
}) => {
  const swiperRef = useRef(null);
  const { data: bannerAdsData, isLoading: adsLoading } = useBannerAds();
  const campaigns = Array.isArray(bannerAdsData?.data) ? bannerAdsData.data.filter(item => item.product !== null) : [];

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
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
          }}
          className="mySwiper"
        >
          {(campaigns.length > 0 ? campaigns : dealsAndDiscounts).map((item, index) => (
            <SwiperSlide key={item?.id || index}>
              {campaigns.length > 0 ? (
                <DealDiscountCard
                  campaignData={item}
                  image={item.media_path}
                  cardIndex={index}
                />
              ) : (
                <DealDiscountCard
                  campaignData={item}
                  image={item.media_path}
                  cardIndex={index}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 absolute top-1/2 -translate-y-1/2 -left-6 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer border border-primary-1010 z-10"
        >
          <ArrowLeft className="w-6 h-6 text-primary-100" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 absolute top-1/2 -translate-y-1/2 -right-6 shadow-lg bg-white rounded-full flex items-center justify-center cursor-pointer border border-primary-1010 z-10"
        >
          <ArrowRight className="w-6 h-6 text-primary-100" />
        </button>
        {/* <div className="flex space-x-2 absolute top-1/2 -translate-y-1/2 w-full justify-between z-10 ">
        </div> */}
      </div>

      {!hideRestaurantCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))
          ) : hasApiData && restaurants.length > 0 ? (
            // Show actual restaurant data
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
                  onFavoriteClick={restaurant.onFavoriteClick || (() => { })}
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
          ) : (
            // Error message when no data available
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium mb-1">
                  No restaurants available
                </p>
                <p className="text-gray-500 text-sm">
                  {apiReturnedEmpty
                    ? "No restaurants found in your area"
                    : "Please try again later"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DealsAndDiscounts;
