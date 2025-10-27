import { useState, useEffect, useCallback } from 'react';
import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";
import { useBannerAds } from "@/hooks/api";

function AllResturants() {
  // Fetch banner ads from API
  const { data: bannerAdsData, isLoading: bannersLoading } = useBannerAds();
  const bannerAds = bannerAdsData?.data || [];

  // State for filters
  const [filters, setFilters] = useState({
    suggested: [],
    category: [],
    distance: [],
    price_range: '',
  });

  // Debounced filters for API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Debounced filter update
  const debouncedUpdateFilters = useCallback(
    debounce((newFilters) => {
      setDebouncedFilters(newFilters);
    }, 1000), // 1 second delay
    []
  );

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    debouncedUpdateFilters(newFilters);
  }, [debouncedUpdateFilters]);

  return (
    <>
      <div className="h-[72px]" />
      <HeroBannerInner />
      <div className='max-w-[1480px] mx-auto'>
      <div className="flex flex-col sm:flex-row gap-x-[30px] px-6 mx-auto justify-center pt-28">
        <div className="md:w-[20%] w-full">
          <ProductFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <div className="my-6">
            {bannerAds.length > 0 ? (
              <CardOne
                key={bannerAds[0]?.id || 'ad-0'}
                campaignData={bannerAds[0]}
              />
            ) : (
              <CardOne
                image="/images/add-card-one.png"
                percentage="25"
                restaurantName="Restaurant Name"
              />
            )}
          </div>
          {bannerAds.length > 1 ? (
            <CardOne
              key={bannerAds[1]?.id || 'ad-1'}
              campaignData={bannerAds[1]}
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
            />
          ) : (
            <CardOne
              image="/images/add-card-two.png"
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
              percentage="25"
              restaurantName="Restaurant Name"
            />
          )}
        </div>
        <div className="md:w-[60%] w-full ">
          <DialyDeals />
          <AllResturantsSection filters={debouncedFilters} />
          {/* <DealsAndDiscounts /> */}
        </div>
        <div className="md:w-[20%] w-full space-y-8">
          {/* Map banner ads starting from index 2 to the end */}
          {bannerAds?.map((banner, index) => (
            <div key={banner?.id || `ad-${index + 2}`}>
             
              {/* Alternate between CardOne and DealDiscountCard */}
              {index % 3 === 0 ? (
                <CardOne
                  campaignData={banner}
                  restaurantNameColor="text-primary-1004"
                  backgroundColor="bg-primary-1011"
                />
              ) : (
                <DealDiscountCard
                  campaignData={banner}
                  cardIndex={index}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}

export default AllResturants;
