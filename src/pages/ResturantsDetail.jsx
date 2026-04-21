import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import ProductCard from "@/components/Cards/ProductCard";
import ProductModal from "@/components/InnerPages/ProductModal";
import ProductDetailBanner from "@/components/InnerPages/ProductDetailBanner";
import ProductDetailMenu from "@/components/InnerPages/ProductDetailMenu";
import SectionInfo from "@/components/InnerPages/SectionInfo";
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRestaurantDetail, useBannerAds } from "@/hooks/api";
import TestimonialCard from "@/components/InnerPages/TestimonialCard";
import TotalTestimonialsBox from "@/components/InnerPages/TotalTestimonialsBox";
import RestaurantDetailSkeleton from "@/components/ui/restaurant-detail-skeleton";

export default function ResturantsDetail() {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { restaurant_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: restaurantData,
    isLoading,
    error,
  } = useRestaurantDetail(restaurant_id);

  // Fetch banner ads
  const {
    data: bannerAdsData,
    isLoading: adsLoading,
  } = useBannerAds();

  // Get restaurant data (will be undefined if loading or error)
  const restaurant = restaurantData?.data;

  // Get banner ads data
  const ads = Array.isArray(bannerAdsData?.data) ? bannerAdsData.data.filter(item => item.product !== null) : [];

  // Split ads for left and right sidebars
  const leftSidebarAds = ads.slice(0, 4);
  const rightSidebarAds = ads.slice(4, 9);

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

  // Handle ad click
  const handleAdClick = (campaign) => {
    const restaurantId = campaign?.restaurant?.id;
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
      setOpen(true);
      return;
    }
  };

  // Ad loading skeleton component
  const AdSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-40 sm:h-48"></div>
    </div>
  );

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

      <div className="bg-primary-1014 pt-12 pb-12">
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Three-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">

            {/* Left Sidebar - Ads Only */}
            <aside className="hidden lg:block w-full lg:w-[250px] xl:w-[280px] flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                {adsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <AdSkeleton key={i} />
                  ))
                ) : (
                  leftSidebarAds.map((campaign, index) => (
                    <div
                      key={campaign?.id || index}
                      onClick={() => handleAdClick(campaign)}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <CardOne
                        campaignData={campaign}
                        image={campaign?.media_path || '/images/placeholder1.jpg'}
                      />
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Main Content - Center */}
            <main className="flex-1 min-w-0">
              {/* Product Categories */}
              {filteredCategories?.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    id={`category-${category.id}`}
                    className="mb-10"
                  >
                    <SectionInfo
                      title={category.name}
                      description={`Explore our delicious ${category.name.toLowerCase()} selection`}
                    />
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
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
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-lg text-gray-500 mb-2">No products found</div>
                  <div className="text-sm text-gray-400">
                    Try searching for a different item
                  </div>
                </div>
              )}

              {/* Testimonials Box */}
              <div className="mb-10">
                <TotalTestimonialsBox
                  rating={restaurant?.rating || 4.5}
                  customerCount={restaurant?.rating_count || 0}
                  ratingData={[
                    {
                      percentage: restaurant?.rating_1 / (restaurant?.rating_count || 1) * 100 || 0,
                      count: restaurant?.rating_1 || 0,
                    },
                    {
                      percentage: restaurant?.rating_2 / (restaurant?.rating_count || 1) * 100 || 0,
                      count: restaurant?.rating_2 || 0,
                    },
                    {
                      percentage: restaurant?.rating_3 / (restaurant?.rating_count || 1) * 100 || 0,
                      count: restaurant?.rating_3 || 0,
                    },
                    {
                      percentage: restaurant?.rating_4 / (restaurant?.rating_count || 1) * 100 || 0,
                      count: restaurant?.rating_4 || 0,
                    },
                    {
                      percentage: restaurant?.rating_5 / (restaurant?.rating_count || 1) * 100 || 0,
                      count: restaurant?.rating_5 || 0,
                    },
                  ]}
                />
              </div>

              {/* Customer Feedback */}
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
            </main>

            {/* Right Sidebar - Ads Only */}
            <aside className="hidden lg:block w-full lg:w-[250px] xl:w-[280px] flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                {adsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <AdSkeleton key={i} />
                  ))
                ) : (
                  rightSidebarAds.map((campaign, index) => (
                    <div
                      key={campaign?.id || index}
                      onClick={() => handleAdClick(campaign)}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      {index % 2 === 0 ? (
                        <CardOne
                          campaignData={campaign}
                          image={campaign?.media_path || '/images/placeholder1.jpg'}
                        />
                      ) : (
                        <DealDiscountCard
                          campaignData={campaign}
                          image={campaign?.media_path || '/images/placeholder1.jpg'}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>

          {/* Mobile/Tablet Bottom Ads Section */}
          <div className="lg:hidden pt-8">
            {!adsLoading && ads.length > 0 && (
              <>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Featured Deals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ads.slice(0, 4).map((campaign, index) => (
                    <div
                      key={campaign?.id || index}
                      onClick={() => handleAdClick(campaign)}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <CardOne
                        campaignData={campaign}
                        image={campaign?.media_path || '/images/placeholder1.jpg'}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
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
