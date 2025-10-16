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
      <div className="flex gap-x-[30px] px-6 mx-auto justify-center pt-28">
        <div className="w-[260px]">
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
        <div className="w-[1067px] ">
          <DialyDeals />
          <AllResturantsSection filters={debouncedFilters} />
          {/* <DealsAndDiscounts /> */}
        </div>
        <div className="w-[350px] space-y-8">
          {/* Ad 3 - CardOne */}
          {bannerAds.length > 2 ? (
            <CardOne
              key={bannerAds[2]?.id || 'ad-2'}
              campaignData={bannerAds[2]}
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
            />
          ) : (
       ""
          )}
          
          {/* Ad 4 - DealDiscountCard */}
          {bannerAds.length > 3 ? (
            <DealDiscountCard
              key={bannerAds[3]?.id || 'ad-3'}
              campaignData={bannerAds[3]}
              cardIndex={2}
            />
          ) : (
      ""
          )}
          
          {/* Ad 5 - DealDiscountCard */}
          {bannerAds.length > 4 ? (
            <DealDiscountCard
              key={bannerAds[4]?.id || 'ad-4'}
              campaignData={bannerAds[4]}
              cardIndex={0}
            />
          ) : (
        ""
          )}
          
          {/* Ad 6 - CardOne */}
          {bannerAds.length > 5 ? (
            <CardOne
              key={bannerAds[5]?.id || 'ad-5'}
              campaignData={bannerAds[5]}
            />
          ) : (
          ""
          )}
          
          {/* Ad 7 - CardOne */}
          {bannerAds.length > 6 ? (
            <CardOne
              key={bannerAds[6]?.id || 'ad-6'}
              campaignData={bannerAds[6]}
              restaurantNameColor="text-primary-1004"
              backgroundColor="bg-primary-1011"
            />
          ) : (
        ""
          )}
          
          {/* Ad 8 - DealDiscountCard */}
          {bannerAds.length > 7 ? (
            <DealDiscountCard
              key={bannerAds[7]?.id || 'ad-7'}
              campaignData={bannerAds[7]}
              cardIndex={1}
            />
          ) : (
          ""
          )}
        </div>
      </div>
    </>
  );
}

export default AllResturants;
