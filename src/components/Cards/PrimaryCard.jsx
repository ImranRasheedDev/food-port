import { Heart, Star, MapPin, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToggleRestaurantLikeById } from "@/hooks/api";
import { toast } from "react-toastify";

export function RestaurantCard({
  image,
  name,
  rating,
  description,
  location,
  distance,
  time,
  onFavoriteClick,
  link = "/resturants-detail",
  isLiked = false,
  restaurantId,
}) {
  const navigate = useNavigate();

  // Toggle favorite mutation
  const toggleFavoriteMutation = useToggleRestaurantLikeById(restaurantId, {
    disableToast: true, // Disable success toast
    onSuccess: () => {
      // Just refetch, no toast message - API cache will be invalidated automatically
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update favorite");
    },
  });

  // Handle heart button click
  const handleHeartClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    e.stopPropagation(); // Stop event bubbling

    // Check if user is logged in
    const isLoggedIn = !window.lodash.isEmpty(window.user);
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    // Toggle favorite
    toggleFavoriteMutation.mutate({});
  };
  return (
    <Link
      to={link}
      className="bg-white border border-primary-500 rounded-lg p-3 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-56 object-cover rounded-md"
        />
        <div
          className="absolute top-3 right-3 p-1 bg-white rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow z-10"
          onClick={handleHeartClick}
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          />
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 max-w-[200px] truncate text-lg">{name}</h3>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full bg-yellow-400 text-white flex justify-center items-center">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 border-b border-dashed border-primary-500 pb-4">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-primary-400">
            <span className="w-2 h-2 flex bg-black rounded-full"></span>
            <span className="max-w-[80px] truncate">{location || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1 border-r border-black/10 pr-2">
              <span className="w-6 h-6 flex bg-primary-50 justify-center items-center rounded-full ">
                <MapPin className="w-4 h-4  stroke-white" />
              </span>
              <span>{distance || "N/A"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 flex bg-primary-50 justify-center items-center rounded-full ">
                <Clock className="w-4 h-4 stroke-white" />
              </span>
              <span>{time || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
