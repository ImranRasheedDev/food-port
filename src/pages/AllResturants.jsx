import AllResturantsSection from "@/components/InnerPages/AllResturantsSection";
import DealsAndDiscounts from "@/components/InnerPages/DealsAndDiscounts";
import DialyDeals from "@/components/InnerPages/DialyDeals";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";

function AllResturants() {
    return (
        <>
            <div className="h-[72px]" />
            <HeroBannerInner />
            <div className="w-[1067px] mx-auto">
                <DialyDeals />
                <AllResturantsSection />
                <DealsAndDiscounts />
            </div>
        </>
    )
}

export default AllResturants;