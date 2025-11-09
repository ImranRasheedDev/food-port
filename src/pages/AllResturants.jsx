import { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import ProductModal from "@/components/InnerPages/ProductModal";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";
import { useBannerAds } from "@/hooks/api";

function AllResturants() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = location.state?.categoryId;
  const categoryName = location.state?.categoryName;

  // Fetch banner ads
  const { data: adsData, isLoading: adsLoading } = useBannerAds();
  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

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
      setSelectedRestaurant(null);
      setIsProductModalOpen(true);
      return;
    }
  };



  return (
    <>
      <div className="h-[72px]" />
      <HeroBannerInner />
      <div className='max-w-[1480px] mx-auto'>
        <div className="flex flex-col sm:flex-row gap-x-[30px] px-6 mx-auto justify-center pt-28">
          {/* Left Sidebar - Filters and Ads */}
          <div className="md:w-[20%] w-full">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Left side ads - CardOne only */}
            <div className="my-6 space-y-6">
              {adsLoading ? (
                // Loading skeleton
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48"></div>
                  </div>
                ))
              ) : (
                ads.slice(0, 4).map((campaign, index) => (
                  <div key={campaign?.id || index} onClick={() => handleAdClick(campaign)} className="cursor-pointer">
                    <CardOne
                      campaignData={campaign}
                      image={campaign?.media_path || '/images/placeholder1.jpg'}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-[60%] w-full">
            <DialyDeals />
            <AllResturantsSection filters={debouncedFilters} />
          </div>

          {/* Right Sidebar - Mixed Ads */}
          <div className="md:w-[20%] w-full">
            <div className="space-y-6">
              {adsLoading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48"></div>
                  </div>
                ))
              ) : (
                ads.slice(4).map((campaign, index) => (
                  <div key={campaign?.id || index} onClick={() => handleAdClick(campaign)} className="cursor-pointer">
                    {index % 3 === 0 ? (
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
