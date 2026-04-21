import { useNavigate } from "react-router-dom";
// No click tracking for ads; navigation handled via Link
import Helper from "@/helpers";
import { useAdClickMutation } from "@/hooks/api";
import { processImageUrl } from "@/lib/utils";
export default function CardOne({
  // Dynamic banner data
  campaignData,
  // Legacy props for backward compatibility
  percentage,
  restaurantName,
  title = "Make Your First Order and Get",
  titleSuffix = "% Off From",
  image,
  backgroundColor = "bg-primary-950",
  titleColor = "text-white",
  restaurantNameColor = "text-primary-1002",
  buttonText = "Order Now",
  buttonTextColor = "text-primary-1002",
  buttonBackgroundColor = "bg-white",
  link = "#",
  onCardClick,
}) {
  const navigate = useNavigate();
  const clickMutation = useAdClickMutation(campaignData?.id);
  // No mutation; we don't track ad clicks
  // Use campaign data if available, otherwise fallback to props
  const displayData = campaignData
    ? {
      percentage: campaignData.discount_percentage,
      restaurantName: Helper.truncateText(
        campaignData.product?.name || "Restaurant",
        20
      ),
      image: image,
      mediaType: campaignData.media_type,
      link:
        // Build dynamic route strictly from campaign payload when present
        campaignData?.product?.restaurant_id && campaignData.product.id
          ? `/resturants-detail/${campaignData.product.restaurant_id}`
          : "#",
    }
    : {
      percentage,
      restaurantName: Helper.truncateText(restaurantName, 20),
      image,
      mediaType: "image", // Default to image for legacy props
      link,
    };

  // Resolve ids from either campaign.restaurant.id or campaign.product.restaurant_id
  const resolvedRestaurantId = campaignData?.restaurant?.id || campaignData?.product?.restaurant_id;
  const resolvedProductId = campaignData?.product?.id;

  return (
    <div
      className={`cursor-pointer text-center pb-10`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopPropagation();
          if (campaignData) {
            if (resolvedRestaurantId && resolvedProductId) {
              clickMutation.mutate({}, { onSettled: () => navigate(`/resturants-detail/${resolvedRestaurantId}`, { state: { productId: resolvedProductId } }) });
              return;
            }
            if (resolvedRestaurantId) {
              clickMutation.mutate({}, { onSettled: () => navigate(`/resturants-detail/${resolvedRestaurantId}`) });
              return;
            }
            if (!resolvedRestaurantId && resolvedProductId && typeof onCardClick === 'function') {
              onCardClick({ productId: resolvedProductId, restaurant: null });
              return;
            }
          }
          if (displayData.link && displayData.link !== "#") {
            navigate(displayData.link);
          }
        }
      }}
      onClick={(e) => {
        if (campaignData) {
          e.preventDefault();
          e.stopPropagation();
          if (resolvedRestaurantId && resolvedProductId) {
            clickMutation.mutate({}, { onSettled: () => navigate(`/resturants-detail/${resolvedRestaurantId}`, { state: { productId: resolvedProductId } }) });
            return;
          }
          if (resolvedRestaurantId) {
            clickMutation.mutate({}, { onSettled: () => navigate(`/resturants-detail/${resolvedRestaurantId}`) });
            return;
          }
          if (!resolvedRestaurantId && resolvedProductId && typeof onCardClick === 'function') {
            onCardClick({ productId: resolvedProductId, restaurant: null });
            return;
          }
          return;
        }
        if (displayData.link && displayData.link !== "#") {
          navigate(displayData.link);
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {displayData.mediaType === "video" ? (
        <img
          src={displayData.image}
          alt={displayData.restaurantName}
          className="w-full h-auto"
        // autoPlay
        // muted
        // loop
        // playsInline
        // onError={(e) => {
        //   e.target.style.display = "none";
        //   const placeholder = e.target.nextElementSibling;
        //   if (placeholder) placeholder.style.display = "block";
        // }}
        />
      ) : (
        <img
          src={processImageUrl(image)}
          alt={displayData.restaurantName || "Card One"}
          onError={(e) => {
            // If image fails to load, show placeholder
            e.target.src = processImageUrl(image);
          }}
        />
      )}

      {/* Placeholder image for video fallback */}
      {displayData.mediaType === "video" && (
        <img
          src={processImageUrl(image)}
          alt="Placeholder"
          className="w-full h-auto"
          style={{ display: "none" }}
          onError={(e) => {
            // If placeholder also fails, keep the original background
            e.target.style.display = "none";
          }}
        />
      )}
      {/* <div className="px-3">
        <h2 className={`${titleColor} font-semibold text-xl mb-4`}>
          Make Your First Order and Get 25% Off From
          <span className={`${restaurantNameColor} ml-2`}>
            Restaurant
          </span>
        </h2>
        <button
          className={`${buttonTextColor} ${buttonBackgroundColor} block w-full cursor-pointer py-2 rounded-full`}
          onClick={(e) => {
            // Handle campaign-driven navigation with click tracking
            if (campaignData) {
              e.preventDefault();
              e.stopPropagation();
              const hasProduct = !!(campaignData?.product?.restaurant_id && campaignData?.product?.id);
              if (!hasProduct) return;
              const target = `/resturants-detail/${campaignData.product.restaurant_id}`;
              clickMutation.mutate({}, {
                onSettled: () => navigate(target)
              });
              return;
            }

            // Legacy fallback: navigate only if link is valid
            if (displayData.link && displayData.link !== "#") {
              navigate(displayData.link);
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {buttonText}
        </button>
      </div> */}
    </div>
  );
}
