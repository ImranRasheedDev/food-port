import AdvertisersSection from "@/components/home/AdvertisersSection";
import AppSection from "@/components/home/AppSection";
import CTASection from "@/components/home/CTASection";
import CuisineForYou from "@/components/home/CuisineForYou";
import HeroBanner from "@/components/home/HeroBanner";
import PopularRestaurants from "@/components/home/PopularRestaurants";
import PopularTruckFood from "@/components/home/PopularTruckFood";
import SearchBar from "@/components/home/SearchBar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

function Home() {
  const user = true;
  return (
    <>
      <HeroBanner user={user} />
      {user && <SearchBar />}
      {user && <AdvertisersSection />}
      {!user && <WhyChooseUs />}
      <CuisineForYou />
      <PopularRestaurants user={user} />
      <PopularTruckFood user={user} />
      {user ? <CTASection /> : <AppSection />}
      {!user && <TestimonialsSection />}
    </>
  );
}

export default Home;
