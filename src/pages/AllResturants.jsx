import { useState, useEffect, useCallback } from 'react';
import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";

function AllResturants() {
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
            <CardOne
              link="/resturants-detail/1"
              image="/images/add-card-one.png"
              percentage="25"
              restaurantName="Restaurant Name"
            />
          </div>
          <CardOne
            link="/resturants-detail/2"
            image="/images/add-card-two.png"
            restaurantNameColor="text-primary-1004"
            backgroundColor="bg-primary-1011"
            percentage="25"
            restaurantName="Restaurant Name"
          />
        </div>
        <div className="w-[1067px] ">
          <DialyDeals />
          <AllResturantsSection filters={debouncedFilters} />
          {/* <DealsAndDiscounts /> */}
        </div>
        <div className="w-[350px] space-y-8">
          <CardOne
            link="/resturants-detail/3"
            image="/images/add-card-two.png"
            restaurantNameColor="text-primary-1004"
            backgroundColor="bg-primary-1011"
            percentage="25"
            restaurantName="Restaurant Name"
          />
          <DealDiscountCard
            title={"Make Your First Order and Get 25% Off From "}
            companyName={"Restaurant Name"}
            link={"#"}
            image={"/images/deals-12.png"}
            cardIndex={2}
          />
          <DealDiscountCard
            title={"Make Your First Order and Get 25% Off From "}
            companyName={"Restaurant Name"}
            link={"#"}
            image={"/images/deals-12.png"}
            cardIndex={0}
          />
          <CardOne
            link="/resturants-detail/4"
            image="/images/add-card-one.png"
            percentage="25"
            restaurantName="Restaurant Name"
          />
          <CardOne
            link="/resturants-detail/5"
            image="/images/add-card-two.png"
            restaurantNameColor="text-primary-1004"
            backgroundColor="bg-primary-1011"
            percentage="25"
            restaurantName="Restaurant Name"
          />
          <DealDiscountCard
            title={"Make Your First Order and Get 25% Off From "}
            companyName={"Restaurant Name"}
            link={"#"}
            image={"/images/deals-12.png"}
            cardIndex={1}
          />
        </div>
      </div>
    </>
  );
}

export default AllResturants;
