import { useEffect, useState } from "react";
import SectionInfo from "./SectionInfo";
import { RestaurantCard } from "../Cards/PrimaryCard";
import { useLikedRestaurants } from "@/hooks/api";
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

const FavouritesFoodTrucks = ({ user = false }) => {
  const { data: likedRestaurantsData, isLoading, error } = useLikedRestaurants();
  
  // Filter for moveable restaurants (food trucks)
  const moveableRestaurants = likedRestaurantsData?.data?.filter(r => r.movable === true || r.movable === 1) || [];
  
  const [foodTrucks, setFoodTrucks] = useState([]);
  const apiArray = moveableRestaurants;
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
        setFoodTrucks(cards);
      }
    }
    loadCards();
  }, [apiArray, maxCards]);

  // Show error state
  if (error) {
    return (
      <div>
        <SectionInfo title={"Food Trucks you like"} />
        <div className="text-center py-12">
          <div className="text-lg text-red-500 mb-2">Error loading favorites</div>
          <div className="text-sm text-gray-400">Please try again later</div>
        </div>
      </div>
    );
  }

  // If no API data, show empty state
  if (!hasApiData && !isLoading) {
    return (
      <div>
        <SectionInfo title={"Food Trucks you like"} />
        <div className="text-center py-12">
          <div className="text-lg text-gray-500 mb-2">No favorite food trucks yet</div>
          <div className="text-sm text-gray-400">Start adding food trucks to your favorites!</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionInfo title={"Food Trucks you like"} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading
          ? Array.from({ length: maxCards }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : foodTrucks.map((card) => (
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

export default FavouritesFoodTrucks;
