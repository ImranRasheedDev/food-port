import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { RestaurantCard } from "../Cards/PrimaryCard";
import { useRestaurants, useAllAddresses } from "@/hooks/api";
import { SkeletonCard } from "@/components/ui/skeleton";
import { NoData } from "@/components/ui/empty";
import { Link } from "react-router-dom";
import LayoutWrapper from "../layoutWrapper";


// const sampleRestaurants = [
//   {
//     name: "KFC",
//     description: "Chicken quesadilla, avocado...",
//     rating: 3.2,
//     image: "/images/popular-1.png",
//     location: "California",
//     distance: "1 km",
//     time: "30 min",
//   },
//   {
//     name: "Poultry Palace",
//     description: "Chicken quesadilla, avocado...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "New Jersey",
//     distance: "3.2 km",
//     time: "25 min",
//   },
//   {
//     name: "The Grill Master's Cafe",
//     description: "Bread, Eggs, Butter, Fries...",
//     rating: 4.3,
//     image: "/images/popular-1.png",
//     location: "New York",
//     distance: "5 km",
//     time: "40 min",
//   },
//   {
//     name: "Cozy Cuppa Cafe",
//     description: "Cheesecake, waffles, Cakes...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "Dallas",
//     distance: "4 km",
//     time: "30 min",
//   },
//   {
//     name: "KFC",
//     description: "Chicken quesadilla, avocado...",
//     rating: 3.2,
//     image: "/images/popular-1.png",
//     location: "California",
//     distance: "1 km",
//     time: "30 min",
//   },
//   {
//     name: "Poultry Palace",
//     description: "Chicken quesadilla, avocado...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "New Jersey",
//     distance: "3.2 km",
//     time: "25 min",
//   },
//   {
//     name: "The Grill Master's Cafe",
//     description: "Bread, Eggs, Butter, Fries...",
//     rating: 4.3,
//     image: "/images/popular-1.png",
//     location: "New York",
//     distance: "5 km",
//     time: "40 min",
//   },
//   {
//     name: "Cozy Cuppa Cafe",
//     description: "Cheesecake, waffles, Cakes...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "Dallas",
//     distance: "4 km",
//     time: "30 min",
//   },
//   {
//     name: "Cozy Cuppa Cafe",
//     description: "Cheesecake, waffles, Cakes...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "Dallas",
//     distance: "4 km",
//     time: "30 min",
//   },
//   {
//     name: "Cozy Cuppa Cafe",
//     description: "Cheesecake, waffles, Cakes...",
//     rating: 3.8,
//     image: "/images/popular-1.png",
//     location: "Dallas",
//     distance: "4 km",
//     time: "30 min",
//   },
// ];
async function mapApiRestaurantToCard(r, userLat, userLng) {
  let distance = "-";
  let time = "-";
  let city = r.address || r.type || "-";

  if (r.coordinates?.latitude && r.coordinates?.longitude) {
    const info = await window.helper.getLocationDetails(
      r.coordinates.latitude,
      r.coordinates.longitude,
      userLat, // user current lat
      userLng // user current lng
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
    image: r.logo_url,
    location: city,
    distance,
    time,
    rating: r.rating,
    isLiked: r.is_like || false, // Get liked status from API
    onFavoriteClick: () => {},
  };
}
export default function PopularRestaurants({ user = false }) {
  const { data, isLoading } = useRestaurants({
    page: 1,
    limit: 10,
    featured: "1",
    moveable: "0",
  });
  
  // Get user addresses to fetch default address coordinates
  const { data: addresses } = useAllAddresses();
  
  const [restaurants, setRestaurants] = useState([]);
  const apiArray = data?.data;
  const hasApiData = apiArray && apiArray.length > 0;
  const apiReturnedEmpty = apiArray && apiArray.length === 0;
  const maxCards = user ? 8 : 4;
  
  // Check if user is logged in
  const isUserLoggedIn = window.lodash.isEmpty(window.user) ? false : true;
  
  // Get user coordinates - either from default address or use static coordinates
  const getUserCoordinates = () => {
    if (isUserLoggedIn && addresses?.data) {
      // Find default address
      const defaultAddress = addresses.data.find(addr => addr.default === true);
      if (defaultAddress && defaultAddress.latitude && defaultAddress.longitude) {
        return {
          lat: parseFloat(defaultAddress.latitude),
          lng: parseFloat(defaultAddress.longitude)
        };
      }
    }
    
    // Fallback to static coordinates (New York coordinates)
    return {
      lat: 40.650426,
      lng: -73.943136
    };
  };
  
  const userCoordinates = getUserCoordinates();
  useEffect(() => {
    async function loadCards() {
      if (apiArray?.length > 0) {
        const cards = await Promise.all(
          apiArray.slice(0, maxCards).map(
            (r) => mapApiRestaurantToCard(r, userCoordinates.lat, userCoordinates.lng) // Dynamic coordinates based on user login status
          )
        );
        setRestaurants(cards);
      }
    }
    loadCards();
  }, [apiArray, userCoordinates.lat, userCoordinates.lng]);
  return (
    <section className="py-16 bg-white">
            <LayoutWrapper> 
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isUserLoggedIn ? (
                <>Restaurants <span className="text-primary-50">near you</span></>
              ) : (
                <>Popular <span className="text-primary-50">Restaurants</span></>
              )}
            </h2>
            <p className="text-gray-600">
              {isUserLoggedIn 
                ? "Find nearby popular Restaurants." 
                : "Discover the most popular Restaurants."
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            Array.from({ length: maxCards }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : hasApiData ? (
            restaurants.map((card) => (
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
                isLiked={card.isLiked}
                restaurantId={card.key}
                link={`/resturants-detail/${card.key}`}
              />
            ))
          ) : apiReturnedEmpty ? (
            <NoData title="No Popular Restaurants" />
          ) : (
       ""
          )}
        </div>

        <div className="text-center">
          <Link
            to={"/all-resturants"}
            className="bg-primary-50 inline-flex justify-center items-center gap-x-3 hover:bg-red-600 text-white px-10 h-12 rounded-full shadow-lg cursor-pointer"
          >
            See All
            <span className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-center">
              <ChevronRight className="w-4 h-4 stroke-primary-50 " />
            </span>
          </Link>
        </div>
      </LayoutWrapper>
    </section>
  );
}
