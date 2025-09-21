import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { RestaurantCard } from "../Cards/PrimaryCard";
import { useRestaurants } from "@/hooks/api";
import { SkeletonCard } from "@/components/ui/skeleton";
import { NoData } from "@/components/ui/empty";
const sampleRestaurants = [
  {
    name: "KFC",
    description: "Chicken quesadilla, avocado...",
    rating: 3.2,
    image: "/images/popular-1.png",
    location: "California",
    distance: "1 km",
    time: "30 min",
  },
  {
    name: "Poultry Palace",
    description: "Chicken quesadilla, avocado...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "New Jersey",
    distance: "3.2 km",
    time: "25 min",
  },
  {
    name: "The Grill Master's Cafe",
    description: "Bread, Eggs, Butter, Fries...",
    rating: 4.3,
    image: "/images/popular-1.png",
    location: "New York",
    distance: "5 km",
    time: "40 min",
  },
  {
    name: "Cozy Cuppa Cafe",
    description: "Cheesecake, waffles, Cakes...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "Dallas",
    distance: "4 km",
    time: "30 min",
  },
  {
    name: "KFC",
    description: "Chicken quesadilla, avocado...",
    rating: 3.2,
    image: "/images/popular-1.png",
    location: "California",
    distance: "1 km",
    time: "30 min",
  },
  {
    name: "Poultry Palace",
    description: "Chicken quesadilla, avocado...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "New Jersey",
    distance: "3.2 km",
    time: "25 min",
  },
  {
    name: "The Grill Master's Cafe",
    description: "Bread, Eggs, Butter, Fries...",
    rating: 4.3,
    image: "/images/popular-1.png",
    location: "New York",
    distance: "5 km",
    time: "40 min",
  },
  {
    name: "Cozy Cuppa Cafe",
    description: "Cheesecake, waffles, Cakes...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "Dallas",
    distance: "4 km",
    time: "30 min",
  },
  {
    name: "Cozy Cuppa Cafe",
    description: "Cheesecake, waffles, Cakes...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "Dallas",
    distance: "4 km",
    time: "30 min",
  },
  {
    name: "Cozy Cuppa Cafe",
    description: "Cheesecake, waffles, Cakes...",
    rating: 3.8,
    image: "/images/popular-1.png",
    location: "Dallas",
    distance: "4 km",
    time: "30 min",
  },
];
function mapApiRestaurantToCard(r) {
  return {
    key: r.id,
    name: r.name,
    description:
      (r.restaurant_categories &&
        r.restaurant_categories.map((c) => c.name).join(", ")) ||
      r.address,
    image: r.bg_image_url,
    location: r.address || r.type || "-",
    distance: r.distance ? `${r.distance} km` : "-",
    time: r.time || "-",
    rating: r.rating,
    onFavoriteClick: () => {},
  };
}
export default function PopularRestaurants({ user = false }) {
  const { data, isLoading } = useRestaurants({
    page: 1,
    per_page: 10,
    featured: "1",
    moveable: "0",
  });
  const apiArray = data?.data;
  const hasApiData = apiArray && apiArray.length > 0;
  const apiReturnedEmpty = apiArray && apiArray.length === 0;
  const maxCards = user ? 8 : 4;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Restaurants <span className="text-primary-50">near you</span>
            </h2>
            <p className="text-gray-600">Find nearby popular Restaurants.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            Array.from({ length: maxCards }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : // 2) API returned with data -> render API cards
          hasApiData ? (
            apiArray.slice(0, maxCards).map((r) => {
              const card = mapApiRestaurantToCard(r);
              return (
                <RestaurantCard
                  key={card.key}
                  name={card.name}
                  description={card.description}
                  image={card.image}
                  location={card.location}
                  distance={card.distance}
                  rating={card.rating}
                  time={card.time}
                  onFavoriteClick={card.onFavoriteClick}
                />
              );
            })
          ) : // 3) API returned but returned empty array -> show "No Data" (Radix-style empty)
          apiReturnedEmpty ? (
            <NoData title="No Popular Restaurants" />
          ) : (
            // 4) Hook didn't return any data object -> fall back to static sample UI
            sampleRestaurants
              .slice(0, maxCards)
              .map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  description={restaurant.description}
                  distance={restaurant.distance}
                  image={restaurant.image}
                  location={restaurant.location}
                  name={restaurant.name}
                  onFavoriteClick={() => {}}
                  rating={restaurant.rating}
                  time={restaurant.time}
                />
              ))
          )}
        </div>

        <div className="text-center">
          <Button className="bg-primary-50 hover:bg-red-600 text-white px-10 h-12 rounded-full shadow-lg cursor-pointer">
            See All
            <span className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-center">
              <ChevronRight className="w-4 h-4 stroke-primary-50 " />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
