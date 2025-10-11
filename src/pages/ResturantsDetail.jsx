import CardOne from "@/components/Cards/AdsCards/CardOne";
import CartCountCard from "@/components/Cards/CartCountCard";
import CartEmpty from "@/components/Cards/CartEmpty";
import DealDiscountCard from "@/components/Cards/DealDiscountCard";
import ProductCard from "@/components/Cards/ProductCard";
import ProductModal from "@/components/InnerPages/ProductModal";
import ProductDetailBanner from "@/components/InnerPages/ProductDetailBanner";
import ProductDetailMenu from "@/components/InnerPages/ProductDetailMenu";
import SectionInfo from "@/components/InnerPages/SectionInfo";
import { productDetailMenu, testimonialCards, menuSections } from "@/components/MockData";
import { useState } from "react";
import TestimonialCard from "@/components/InnerPages/TestimonialCard";
import TotalTestimonialsBox from "@/components/InnerPages/TotalTestimonialsBox";


export default function ResturantsDetail() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className="h-[72px]" />
            <ProductDetailBanner image="/images/product-1.png" tags={["Burgers", "Fast Food", "Western", "Broast"]} restaurantName="KFC - New York" minOrderUnit="7.00" restaurantOpenTime="10:00" restaurantCloseTime="22:00" location="New York, NY" rating="4.8" ratingCount="25000" />

            <ProductDetailMenu menuItems={menuSections.map((section) => ({
                id: section.id,
                name: section.title,
                count: section.products.length
            }))} />
            <div className="bg-primary-1014 pt-20 pb-20">
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-x-[30px] px-6 mx-auto justify-center ">
                    <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-1 col-span-1 space-y-8 pt-22 hidden xl:block">
                        <CardOne image="/images/add-card-one.png" percentage="25" restaurantName="Restaurant Name" />
                        <CardOne image="/images/add-card-two.png" restaurantNameColor="text-primary-1004" backgroundColor="bg-primary-1011" percentage="25" restaurantName="Restaurant Name" />
                        <CardOne image="/images/add-card-three.png" restaurantNameColor="text-primary-1002" backgroundColor="bg-primary-1004" percentage="25" restaurantName="Restaurant Name" />
                    </div>
                    <div className="2xl:col-span-2 xl:col-span-1 lg:col-span-1 col-span-1 max-xl:order-2 ">
                        {menuSections.map((section) => (
                            <div key={section.id} id={section.id} className="mb-10">
                                <SectionInfo
                                    title={section.title}
                                    description={section.description}
                                />
                                <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-4">
                                    {section.products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            onClick={() => setOpen(true)}
                                            title={product.title}
                                            price={product.price}
                                            description={product.description}
                                            image={product.image}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="mb-10">
                            <TotalTestimonialsBox rating={4.5}
                                customerCount={934516}
                                ratingData={[
                                    { percentage: 63, count: 94532 },   // 1-star
                                    { percentage: 24, count: 6.717 },  // 2-star
                                    { percentage: 9, count: 714 },  // 3-star
                                    { percentage: 1, count: 152 },  // 4-star
                                    { percentage: 7, count: 643 }  // 5-star
                                ]} />
                        </div>
                        <div className="mb-10">
                            <SectionInfo title={"Customer Feedback"} />
                            <div className="space-y-6 pt-3">
                                {
                                    testimonialCards.map((card) => (
                                        <TestimonialCard key={card.id} {...card} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-1 col-span-1 space-y-8 pt-22 max-xl:order-1">
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