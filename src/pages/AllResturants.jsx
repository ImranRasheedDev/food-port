import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, X, SlidersHorizontal } from 'lucide-react';
import SearchBar from "@/components/home/SearchBar";
import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import ProductModal from "@/components/InnerPages/ProductModal";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";
import { useBannerAds } from "@/hooks/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function AllResturants() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = location.state?.categoryId;
  const categoryName = location.state?.categoryName;

  // Get location coordinates from route state (from SearchBar location search)
  const locationLatitude = location.state?.latitude;
  const locationLongitude = location.state?.longitude;
  const locationName = location.state?.locationName;

  // Fetch banner ads
  const { data: adsData, isLoading: adsLoading } = useBannerAds();
  const ads = Array.isArray(adsData?.data) ? adsData.data.filter(item => item.product !== null) : [];

  // Split ads for left and right sidebars
  const leftSidebarAds = ads.slice(0, 3);
  const rightSidebarAds = ads.slice(3, 8);

  // State for filters - initialize with category and location from route state
  const [filters, setFilters] = useState({
    suggested: [],
    category: categoryId ? [categoryId] : [],
    distance: [],
    price_range: '',
    latitude: locationLatitude || null,
    longitude: locationLongitude || null,
    locationName: locationName || '',
  });

  // Debounced filters for API calls - initialize with category and location from route state
  const [debouncedFilters, setDebouncedFilters] = useState({
    suggested: [],
    category: categoryId ? [categoryId] : [],
    distance: [],
    price_range: '',
    latitude: locationLatitude || null,
    longitude: locationLongitude || null,
    locationName: locationName || '',
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

  // Handle clearing location filter
  const handleClearLocation = useCallback(() => {
    const newFilters = {
      ...filters,
      latitude: null,
      longitude: null,
      locationName: '',
    };
    setFilters(newFilters);
    setDebouncedFilters(newFilters);
    // Clear location state from URL
    navigate('/all-resturants', { replace: true, state: { ...location.state, latitude: null, longitude: null, locationName: null } });
  }, [filters, navigate, location.state]);

  // Handle location selection from SearchBar
  const handleLocationSelect = useCallback(({ latitude, longitude, locationName }) => {
    const newFilters = {
      ...filters,
      latitude,
      longitude,
      locationName,
    };
    setFilters(newFilters);
    setDebouncedFilters(newFilters);
    // Update URL state
    navigate('/all-resturants', { replace: true, state: { ...location.state, latitude, longitude, locationName } });
  }, [filters, navigate, location.state]);

  // Update filters when location state changes (e.g., navigating from SearchBar)
  useEffect(() => {
    if (locationLatitude && locationLongitude) {
      setFilters(prev => ({
        ...prev,
        latitude: locationLatitude,
        longitude: locationLongitude,
        locationName: locationName || '',
      }));
      setDebouncedFilters(prev => ({
        ...prev,
        latitude: locationLatitude,
        longitude: locationLongitude,
        locationName: locationName || '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationLatitude, locationLongitude, locationName]);

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

  // Ad loading skeleton component
  const AdSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-40 sm:h-48"></div>
    </div>
  );

  return (
    <>
      <div className="h-[72px]" />
      <HeroBannerInner />

      {/* SearchBar - same as home page */}
      <SearchBar
        initialLocationName={debouncedFilters.locationName}
        initialLatitude={debouncedFilters.latitude}
        initialLongitude={debouncedFilters.longitude}
        onLocationSelect={handleLocationSelect}
      />

      <div className='w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Location Filter Indicator */}
        {debouncedFilters.latitude && debouncedFilters.longitude && debouncedFilters.locationName && (
          <div className='pt-4'>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Showing results near:</span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" />
                <span>{debouncedFilters.locationName}</span>
                <button
                  onClick={handleClearLocation}
                  className="ml-1 p-0.5 hover:bg-primary-200 rounded-full transition-colors"
                  aria-label="Clear location filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Button */}
        <div className="lg:hidden pt-4 pb-2">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Three-Column Layout */}
        <div className={`flex flex-col lg:flex-row gap-6 xl:gap-8 ${debouncedFilters.latitude && debouncedFilters.longitude && debouncedFilters.locationName ? 'pt-4' : 'pt-8 sm:pt-12 lg:pt-16 xl:pt-20'} pb-8 sm:pb-12`}>

          {/* Left Sidebar - Filters and Ads */}
          <aside className="hidden lg:block w-full lg:w-[250px] xl:w-[280px] flex-shrink-0">
            {/* Filters Section */}
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />

              {/* Left sidebar ads */}
              <div className="mt-6 space-y-4">
                {adsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
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
            </div>
          </aside>

          {/* Main Content - Center */}
          <main className="flex-1 min-w-0">
            {/* All Restaurants Section with Pagination */}
            <AllResturantsSection filters={debouncedFilters} />
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
        <div className="lg:hidden pb-8">
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
