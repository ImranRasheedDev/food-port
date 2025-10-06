import { useEffect, useState } from "react";
import { RestaurantCard } from "../Cards/PrimaryCard";
import SectionInfo from "../InnerPages/SectionInfo";
import { useRestaurants } from "@/hooks/api";
import { SkeletonCard } from "@/components/ui/skeleton";

async function mapApiRestaurantToCard(r, userLat, userLng) {
  let distance = "-";
  let time = "-";
  let city = r.address || r.type || "-";

  if (r.coordinates?.latitude && r.coordinates?.longitude) {
    const info = await window.helper.getLocationDetails(
      r.coordinates.latitude,
      r.coordinates.longitude,
      userLat,
      userLng
    );
    distance = info.distance;
    time = info.duration;
    city = info.city;
  }

  return {
    key: r.id,
    name: r.name,
    description:
      (r.restaurant_categories &&
        r.restaurant_categories.map((c) => c.name).join(", ")) ||
      r.address,
    image: r.bg_image_url,
    location: city,
    distance,
    time,
    rating: r.rating,
    onFavoriteClick: () => {},
  };
}

const FavouritesRestaurants = ({ user = false }) => {
  const { data, isLoading } = useRestaurants({
    page: 1,
    per_page: 10,
    featured: "1",
    moveable: "0",
    liked: true,
  });

  const [restaurants, setRestaurants] = useState([]);
  const apiArray = data?.data;
  const hasApiData = apiArray && apiArray.length > 0;
  const maxCards = user ? 8 : 4;

  useEffect(() => {
    async function loadCards() {
      if (apiArray?.length > 0) {
        const cards = await Promise.all(
          apiArray
            .slice(0, maxCards)
            .map((r) => mapApiRestaurantToCard(r, 40.650426, -73.943136))
        );
        setRestaurants(cards);
      }
    }
    loadCards();
  }, [apiArray]);

  // If no API data, show nothing
  if (!hasApiData && !isLoading) return null;

  return (
    <div>
      <SectionInfo title={"Restaurants you like"} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading
          ? Array.from({ length: maxCards }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : restaurants.map((card) => (
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
            ))}
      </div>
    </div>
  );
};

export default FavouritesRestaurants;
