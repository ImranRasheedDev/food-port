import CardOne from "@/components/Cards/AdsCards/CardOne";
import CartCountCard from "@/components/Cards/CartCountCard";
import CartEmpty from "@/components/Cards/CartEmpty";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import ProductCard from "@/components/Cards/ProductCard";
import HeroBannerInner from "@/components/InnerPages/HeroBannerInner";
import ProductModal from "@/components/InnerPages/ProductModal";
import ProductDetailBanner from "@/components/InnerPages/ProductDetailBanner";
import ProductDetailMenu from "@/components/InnerPages/ProductDetailMenu";
import SectionInfo from "@/components/InnerPages/SectionInfo";
import { productDetailMenu } from "@/components/MockData";
import { useState } from "react";


export default function ResturantsDetail() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="h-[72px]" />
            <ProductDetailBanner image="/images/product-1.png" tags={["Burgers", "Fast Food", "Western", "Broast"]} restaurantName="KFC - New York" minOrderUnit="7.00" restaurantOpenTime="10:00" restaurantCloseTime="22:00" location="New York, NY" rating="4.8" ratingCount="25000" />

            <ProductDetailMenu menuItems={productDetailMenu} />
            <div className="bg-primary-1014">
                <div className="flex gap-x-[30px] px-6 mx-auto justify-center pt-28">
                    <div className="w-[260px] space-y-8">
                        <CardOne image="/images/add-card-one.png" percentage="25" restaurantName="Restaurant Name" />
                        <CardOne image="/images/add-card-two.png" restaurantNameColor="text-primary-1004" backgroundColor="bg-primary-1011" percentage="25" restaurantName="Restaurant Name" />
                        <CardOne image="/images/add-card-three.png" restaurantNameColor="text-primary-1002" backgroundColor="bg-primary-1004" percentage="25" restaurantName="Restaurant Name" />
                    </div>
                    <div className="w-[928px]">
                        <div>
                            <SectionInfo title={"Popular"} description={"Most ordered right now."} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                            </div>

                        </div>
                        <div>
                            <SectionInfo title={"Everyday Value"} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                            </div>
                        </div>
                        <div>
                            <SectionInfo title={"Meal Box"} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />

                            </div>
                        </div>
                        <div>
                            <SectionInfo title={"Family Deals"} />
                            <div className="grid grid-cols-2 gap-4">
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                                <ProductCard onClick={() => setOpen(true)} title={"Midnight Deal 02"} price={"10.00"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} image={"/images/product-1.png"} />
                            </div>
                        </div>
                    </div>
                    <div className="w-[350px] space-y-8">
                        <CartCountCard image={"/images/product-1.png"} productName={"Midnight Deal 02"} price={"10.00"} count={1} totalPrice={"10.00"} vatPrice={"1.00"} platformFee={"1.00"} />
                        <CartEmpty />
                        <CardOne image="/images/add-card-two.png" restaurantNameColor="text-primary-1004" backgroundColor="bg-primary-1011" percentage="25" restaurantName="Restaurant Name" />
                        <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={2} />
                        <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={0} />
                        {/* <CardOne image="/images/add-card-one.png" percentage="25" restaurantName="Restaurant Name" />
                    <CardOne image="/images/add-card-two.png" restaurantNameColor="text-primary-1004" backgroundColor="bg-primary-1011" percentage="25" restaurantName="Restaurant Name" /> */}
                        <DealDiscountCard title={"Make Your First Order and Get 25% Off From "} companyName={"Restaurant Name"} link={"#"} image={"/images/deals-12.png"} cardIndex={1} />
                    </div>
                </div>
            </div>
            <ProductModal open={open} setOpen={setOpen} image={"/images/full-image.png"} title={"Midnight Deal 02"} description={"2 whole muscle zingers with cheese and fresh lettuce, all bundled in a…"} price={"10.00"} />
        </>
    )
}