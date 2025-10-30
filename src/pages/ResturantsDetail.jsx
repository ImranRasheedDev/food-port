import CardOne from "@/components/Cards/AdsCards/CardOne";
import DynamicCart from "@/components/Cards/DynamicCart";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import ProductCard from "@/components/Cards/ProductCard";
import ProductModal from "@/components/InnerPages/ProductModal";
import ProductDetailBanner from "@/components/InnerPages/ProductDetailBanner";
import ProductDetailMenu from "@/components/InnerPages/ProductDetailMenu";
import SectionInfo from "@/components/InnerPages/SectionInfo";
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useRestaurantDetail, useBannerAds } from "@/hooks/api";
import { menuSections } from "@/components/MockData";
import TestimonialCard from "@/components/InnerPages/TestimonialCard";
import TotalTestimonialsBox from "@/components/InnerPages/TotalTestimonialsBox";
import RestaurantDetailSkeleton from "@/components/ui/restaurant-detail-skeleton";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import ChickenSandwichCard from "@/components/Cards/ChickenSandwichCard";
import LazyAdContainer from "@/components/ui/LazyAdContainer";
import { useLazyAds } from "@/hooks/useLazyAds";

export default function ResturantsDetail() {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { restaurant_id } = useParams();
  const location = useLocation();

  const {
    data: restaurantData,
    isLoading,
    error,
  } = useRestaurantDetail(restaurant_id);

  // Fetch banner ads
  const {
    data: bannerAdsData,
    isLoading: bannersLoading,
  } = useBannerAds();

  // Get restaurant data (will be undefined if loading or error)
  const restaurant = restaurantData?.data;
  
  // Get banner ads data
  const bannerAds = bannerAdsData?.data || [];
  
  // Lazy loading for left side ads
  const { 
    ads: leftAds, 
    isLoading: leftLoading, 
    hasMore: leftHasMore, 
    containerRef: leftContainerRef, 
    loadingRef: leftLoadingRef 
  } = useLazyAds(3);
  
  // Lazy loading for right side ads
  const { 
    ads: rightAds, 
    isLoading: rightLoading, 
    hasMore: rightHasMore, 
    containerRef: rightContainerRef, 
    loadingRef: rightLoadingRef 
  } = useLazyAds(3);
  
  // Get product categories for menu (empty array if no data)
  const allProductCategories = restaurant?.product_categories || [];
  // Filter categories and products based on search term - MUST be before early returns
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return allProductCategories;
    }

    const searchLower = searchTerm.toLowerCase();
    
    return allProductCategories
      .map(category => {
        const filteredProducts = category.products?.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
        ) || [];

        return {
          ...category,
          products: filteredProducts
        };
      })
      .filter(category => 
        category.products.length > 0 || 
        category.name.toLowerCase().includes(searchLower)
      );
  }, [allProductCategories, searchTerm]);

  // Auto-open product modal if productId is provided via route state
  useEffect(() => {
    const pid = location?.state?.productId;
    if (pid) {
      setSelectedProductId(pid);
      setOpen(true);
    }
  }, [location?.state]);

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Early returns AFTER all hooks
  if (isLoading) {
    return <RestaurantDetailSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <>
        <div className="h-[72px]" />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            Error loading restaurant details
          </div>
        </div>
      </>
    );
  }

  // Helper function to get business hours
  const getCurrentDayHours = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[new Date().getDay()];
    return restaurant?.business_hours?.[currentDay];
  };

  const currentHours = getCurrentDayHours();
  const isOpen = restaurant?.is_open && currentHours && !currentHours.is_close;

  // Get restaurant categories as tags
  const tags = restaurant?.restaurant_categories?.map((cat) => cat.name) || [];

  console.log(filteredCategories,"filteredCategories")

const staticImages=["/images/add-card-one.png","/images/add-card-two.png","/images/deals-14.png","/images/add-card-two.png"]
  return (
    <>

      <div className="h-[72px]" />
      <ProductDetailBanner
        image={restaurant?.logo_url || "/images/placeholder1.jpg"}
        tags={tags}
        restaurantName={restaurant?.name || "Restaurant"}
        minOrderUnit={restaurant?.delivery_fee?.toString() || "7.00"}
        restaurantOpenTime={currentHours?.open || "10:00"}
        restaurantCloseTime={currentHours?.close || "22:00"}
        location={restaurant?.address || "Location"}
        rating={restaurant?.rating?.toString() || "4.8"}
        ratingCount={restaurant?.rating_count?.toString() || "0"}
        restaurantId={restaurant_id}
        isLiked={restaurant?.is_like || false}
      />

      <ProductDetailMenu
        menuItems={filteredCategories.map((category) => ({
          id: `category-${category.id}`,
          name: category.name,
          count: category.products?.length || 0,
        }))}
        onSearchChange={handleSearchChange}
      />
      <div className="bg-primary-1014 pt-20 pb-20">
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-x-[30px] px-6 mx-auto justify-center ">
          <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-1 col-span-1 pt-22 hidden xl:block">
            {/* Lazy loaded left side ads */}
            <LazyAdContainer
              ads={leftAds}
              isLoading={leftLoading}
              hasMore={leftHasMore}
              containerRef={leftContainerRef}
              loadingRef={leftLoadingRef}
              type="card"
              staticImages={staticImages}
              onCardClick={({ productId }) => { setSelectedProductId(productId); setOpen(true); }}
            />
          </div>
          <div className="2xl:col-span-2 xl:col-span-1 lg:col-span-1 col-span-1 max-xl:order-2 ">
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <div
                    id={`category-${category.id}`}
                    className="mb-10"
                  >
                    <SectionInfo
                      title={category.name}
                      description={`Explore our delicious ${category.name.toLowerCase()} selection`}
                    />
                    <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-4">
                      {category.products?.map((product) => (
                        <ProductCard
                          key={product.id}
                          onClick={() => {
                            setSelectedProductId(product.id);
                            setOpen(true);
                          }}
                          title={product.name}
                          price={product.price?.toString() || "0.00"}
                          description={product.description}
                          image={product.image_url || "/images/product-1.png"}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Show Deals and Discounts after the first category only */}
                  {index === 0 && (
                    <div className="mb-10">
                      <DealsAndDiscounts 
                        restaurants={bannerAds} 
                        isLoading={false} 
                        hasApiData={false} 
                        apiReturnedEmpty={false}
                        hideRestaurantCards={true}
                        image={staticImages[index % staticImages.length]}
                      />
                    </div>
                  )}

                  {
                    index === 2 && (
                      <div className="mb-10">
                        <ChickenSandwichCard image={staticImages[index % staticImages.length]} />
                      </div>
                    )
                  }
                
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-lg text-gray-500 mb-2">No products found</div>
                <div className="text-sm text-gray-400">
                  Try searching for a different item
                </div>
              </div>
            )}
            
            <div className="mb-10">
              <TotalTestimonialsBox
                rating={restaurant?.rating || 4.5}
                customerCount={restaurant?.rating_count || 0}
                ratingData={[
                  {
                    percentage: restaurant?.rating_1 || 0,
                    count: restaurant?.rating_1 || 0,
                  },
                  {
                    percentage: restaurant?.rating_2 || 0,
                    count: restaurant?.rating_2 || 0,
                  },
                  {
                    percentage: restaurant?.rating_3 || 0,
                    count: restaurant?.rating_3 || 0,
                  },
                  {
                    percentage: restaurant?.rating_4 || 0,
                    count: restaurant?.rating_4 || 0,
                  },
                  {
                    percentage: restaurant?.rating_5 || 0,
                    count: restaurant?.rating_5 || 0,
                  },
                ]}
              />
            </div>
            <div className="mb-10">
              <SectionInfo title={"Customer Feedback"} />
              <div className="space-y-6 pt-3">
                {restaurant?.ratings && restaurant.ratings.length > 0 ? (
                  restaurant.ratings.map((rating) => (
                    <TestimonialCard 
                      key={rating.id}
                      id={rating.id}
                      name={rating.customer?.user?.name || 'Anonymous'}
                      rating={rating.rating}
                      comment={rating.comment}
                      date={rating.created_at}
                      img={rating.customer?.user?.image || "/images/avatar.jpg"}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Customer feedback not yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="2xl:col-span-1 mb-4 md:mb-0 xl:col-span-1 lg:col-span-1 col-span-1 pt-22 max-xl:order-1">
            <DynamicCart restaurantData={restaurant} ads={bannerAds} />
            
            {/* Lazy loaded right side ads */}
            <LazyAdContainer
              ads={rightAds}
              isLoading={rightLoading}
              hasMore={rightHasMore}
              containerRef={rightContainerRef}
              loadingRef={rightLoadingRef}
              type="deal"
              staticImages={staticImages}
              onCardClick={({ productId }) => { setSelectedProductId(productId); setOpen(true); }}
            />
          </div>

        </div>
      </div>
      <ProductModal
        open={open}
        setOpen={setOpen}
        productId={selectedProductId}
        restaurantData={restaurant}
      />
    </>
  );
}
