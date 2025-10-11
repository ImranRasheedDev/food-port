import CardOne from "@/components/Cards/AdsCards/CardOne";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductFilters from "@/components/InnerPages/ProductFilters";

function AllResturants() {
  return (
    <>
      <div className="h-[72px]" />
      <HeroBannerInner />
      <div className="flex gap-x-[30px] px-6 mx-auto justify-center pt-28">
        <div className="w-[260px]">
          <ProductFilters />
          <div className="my-6">
            <CardOne
              link="/resturants-detail"
              image="/images/add-card-one.png"
              percentage="25"
              restaurantName="Restaurant Name"
            />
          </div>
          <CardOne
            link="/resturants-detail"
            image="/images/add-card-two.png"
            restaurantNameColor="text-primary-1004"
            backgroundColor="bg-primary-1011"
            percentage="25"
            restaurantName="Restaurant Name"
          />
        </div>
        <div className="w-[1067px] ">
          <DialyDeals />
          <AllResturantsSection />
          <DealsAndDiscounts />
        </div>
        <div className="w-[350px] space-y-8">
          <CardOne
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
            image="/images/add-card-one.png"
            percentage="25"
            restaurantName="Restaurant Name"
          />
          <CardOne
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
