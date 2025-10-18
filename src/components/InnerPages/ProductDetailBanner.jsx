import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToggleRestaurantLikeById } from "@/hooks/api";

export default function ProductDetailBanner({
  image,
  tags,
  restaurantName,
  minOrderUnit,
  restaurantOpenTime,
  restaurantCloseTime,
  location,
  rating,
  ratingCount,
  restaurantId,
  isLiked = false,
}) {
  const navigate = useNavigate();

  const toggleLikeMutation = useToggleRestaurantLikeById(restaurantId, {
    onSuccess: () => {
      console.log("Restaurant like status toggled successfully");
    },
    onError: (error) => {
      console.error("Error toggling restaurant like:", error);
    },
  });

  const handleFavoriteClick = () => {
    const isLoggedIn = window.lodash?.isEmpty(window.user) ? false : true;
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    if (restaurantId) {
      toggleLikeMutation.mutate({});
    } else {
      console.error("No restaurant ID provided - cannot toggle like");
    }
  };

  return (
    <div className="bg-primary-1014 flex items-center w-full lg:h-[300px] ">
      {/* Outer full-width background */}
      <div className="w-full px-4">
        {/* Centered content container */}
        <div className="max-w-[1280px] px-4 mx-auto py-16 md:py-0 flex flex-col md:flex-row flex-wrap items-start w-full">
          <div className="min-sm:flex md:gap-x-10 gap-x-4 flex-1">
            <div className="flex-shrink-0 max-sm:mb-4">
              <img
                src={image}
                alt="Product Detail Banner"
                className="lg:w-[156px] lg:h-[156px] w-[100px] h-[100px] object-cover rounded-lg"
              />
            </div>

            <div>
              <div className="flex mb-3">
                <ul className="flex flex-wrap gap-x-6 text-primary-1013">
                  {tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>

              <h1 className="text-black md:text-4xl text-3xl font-bold mb-3">
                {restaurantName}
              </h1>

              <div className="flex flex-wrap gap-x-3 mb-2">
                {/* Min Order */}
                <div className="flex items-center gap-x-2">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      fill="none"
                      viewBox="0 0 16 17"
                    >
                      <path
                        fill="#333"
                        fillRule="evenodd"
                        d="M11.397 5.14a.43.43 0 0 1-.403-.303 3.4 3.4 0 0 0-.736-1.25 3.04 3.04 0 0 0-2.227-.997c-.835 0-1.637.358-2.227.996a3.4 3.4 0 0 0-.736 1.25.43.43 0 0 1-.402.304H3.15a1.15 1.15 0 0 0-1.135 1.336l1.171 7.15a1.15 1.15 0 0 0 1.135.964h7.512a1.15 1.15 0 0 0 1.14-.993l.987-7.15a1.148 1.148 0 0 0-1.14-1.307zm-2.22 0c.15 0 .247-.158.166-.283-.263-.409-.656-.767-1.313-.767-.658 0-1.04.36-1.29.77-.078.126.02.28.166.28zM4.96 13.09a.4.4 0 0 1-.395-.335L3.6 6.872a.2.2 0 0 1 .198-.232h8.391a.2.2 0 0 1 .198.227l-.812 5.878a.4.4 0 0 1-.396.345z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#333"
                        d="M7.083 10.862A.752.752 0 1 1 6.02 9.799L7.51 8.31a.75.75 0 0 1 .54-.22.75.75 0 0 1 .538.22l1.489 1.489a.752.752 0 1 1-1.064 1.063l-.215-.216-.752-.736-.752.742z"
                      ></path>
                    </svg>
                  </span>
                  <span>Min. order ${minOrderUnit}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    fill="none"
                    viewBox="0 0 16 17"
                  >
                    <path
                      fill="#FFB413"
                      fillRule="evenodd"
                      d="M7.884 12.785 4.89 14.37a.493.493 0 0 1-.718-.525l.572-3.353a.25.25 0 0 0-.07-.22L2.248 7.896a.5.5 0 0 1 .274-.848l3.35-.49a.25.25 0 0 0 .185-.135L7.556 3.37a.493.493 0 0 1 .887 0l1.498 3.052a.25.25 0 0 0 .186.136l3.349.489a.497.497 0 0 1 .274.848l-2.423 2.375a.25.25 0 0 0-.071.22l.572 3.353a.497.497 0 0 1-.718.525l-2.995-1.584a.25.25 0 0 0-.23 0"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="#E03000"
                      fillRule="evenodd"
                      d="m5.329 13 2.088-1.103c.365-.193.8-.193 1.165 0l2.088 1.104-.4-2.346a1.25 1.25 0 0 1 .357-1.102l1.7-1.667-2.345-.342a1.25 1.25 0 0 1-.939-.685L8 4.733 6.956 6.86c-.18.368-.531.625-.94.685l-2.344.342 1.7 1.667c.293.287.426.7.357 1.102zm-.44 1.364 2.995-1.583a.25.25 0 0 1 .23 0l2.996 1.583a.497.497 0 0 0 .718-.524l-.572-3.353a.25.25 0 0 1 .07-.22l2.424-2.375a.499.499 0 0 0-.274-.848l-3.349-.49a.25.25 0 0 1-.186-.136l-1.498-3.05a.493.493 0 0 0-.887 0l-1.498 3.05a.25.25 0 0 1-.186.136l-3.349.49a.5.5 0 0 0-.274.848l2.423 2.375a.25.25 0 0 1 .071.22l-.572 3.353a.493.493 0 0 0 .718.524"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>{rating}</span>
                  <span className="text-primary-1013"> ({ratingCount}+)</span>
                </div>
              </div>

              {/* Open / Location Info */}
              <div>
                <p className="flex flex-wrap items-center gap-x-2">
                  <span className="text-primary-1004 font-semibold">Open</span>
                  <span className="text-primary-950 font-semibold">
                    {restaurantOpenTime} - {restaurantCloseTime}
                  </span>
                  <span className="text-black font-semibold">{location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          <div className="ml-auto self-end">
            <button
              onClick={handleFavoriteClick}
              disabled={toggleLikeMutation.isPending}
              className={`${
                isLiked
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-primary-50 hover:bg-primary-60"
              } text-white rounded-full px-10 py-4 flex items-center gap-x-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {toggleLikeMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLiked ? "Removing..." : "Adding..."}
                </>
              ) : (
                <>
                  {isLiked ? "Remove from favorite" : "Add to favorite"}
                  <Heart className={isLiked ? "fill-current" : ""} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
