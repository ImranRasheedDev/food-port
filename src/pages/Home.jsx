import CuisineForYou from "@/components/home/CuisineForYou";
import HeroBanner from "@/components/home/HeroBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";

function Home() {
  console.log("window.user", window.user);
  return (
    <>
      <HeroBanner />
      <WhyChooseUs />
      <CuisineForYou />
    </>
  );
}

export default Home;
