import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import ProductModal from "@/components/InnerPages/ProductModal";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";
import { useBannerAds } from "@/hooks/api";
import LazyAdContainer from "@/components/ui/LazyAdContainer";
import { useLazyAds } from "@/hooks/useLazyAds";

function AllResturants() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  // Get location state for category ID
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  const categoryName = location.state?.categoryName;

  // Lazy loading for left side ads
  const { 
    ads: leftAds, 
    isLoading: leftLoading, 
    hasMore: leftHasMore, 
    containerRef: leftContainerRef, 
    loadingRef: leftLoadingRef 
  } = useLazyAds(2);
  
  // Lazy loading for right side ads
  const { 
    ads: rightAds, 
    isLoading: rightLoading, 
    hasMore: rightHasMore, 
    containerRef: rightContainerRef, 
    loadingRef: rightLoadingRef 
  } = useLazyAds(3);

  // State for filters - initialize with category from route state
  const [filters, setFilters] = useState({
    suggested: [],
    category: categoryId ? [categoryId] : [],
    distance: [],
    price_range: '',
  });

  // Debounced filters for API calls - initialize with category from route state
  const [debouncedFilters, setDebouncedFilters] = useState({
    suggested: [],
    category: categoryId ? [categoryId] : [],
    distance: [],
    price_range: '',
  });

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
          
          {/* Lazy loaded left side ads */}
          <div className="my-6">
            <LazyAdContainer
              ads={leftAds}
              isLoading={leftLoading}
              hasMore={leftHasMore}
              containerRef={leftContainerRef}
              loadingRef={leftLoadingRef}
              type="card"
              staticImages={['/images/add-card-one.png', '/images/add-card-two.png']}
              onCardClick={({ productId, restaurant }) => { 
                setSelectedProductId(productId); 
                setSelectedRestaurant(restaurant); 
                setIsProductModalOpen(true); 
              }}
            />
          </div>
        </div>
        <div className="md:w-[60%] w-full ">
          <DialyDeals />
          <AllResturantsSection filters={debouncedFilters} />
          {/* <DealsAndDiscounts /> */}
        </div>
        <div className="md:w-[20%] w-full">
          {/* Lazy loaded right side ads */}
          <LazyAdContainer
            ads={rightAds}
            isLoading={rightLoading}
            hasMore={rightHasMore}
            containerRef={rightContainerRef}
            loadingRef={rightLoadingRef}
            type="mixed"
            staticImages={['/images/add-card-two.png', '/images/deals-14.png', '/images/add-card-one.png']}
            onCardClick={({ productId, restaurant }) => { 
              setSelectedProductId(productId); 
              setSelectedRestaurant(restaurant); 
              setIsProductModalOpen(true); 
            }}
          />
        </div>
      </div>
      </div>
      <ProductModal
        open={isProductModalOpen}
        setOpen={setIsProductModalOpen}
        productId={selectedProductId}
        restaurantData={selectedRestaurant}
      />
    </>
  );
}

export default AllResturants;
