import { Link } from "react-router-dom";
import { trackAdClick, useAdClickMutation } from "@/hooks/api";
import Helper from "@/helpers";

export default function CardOne({
    // Dynamic banner data
    campaignData,
    // Legacy props for backward compatibility
    percentage,
    restaurantName,
    title = "Make Your First Order and Get",
    titleSuffix = "% Off From",
    image = "/images/add-card-one.png",
    backgroundColor = "bg-primary-950",
    titleColor = "text-white",
    restaurantNameColor = "text-primary-1002",
    buttonText = "Order Now",
    buttonTextColor = "text-primary-1002",
    buttonBackgroundColor = "bg-white",
    link = "#"
}) {
    const clickMutation = useAdClickMutation(campaignData?.id);

    // Use campaign data if available, otherwise fallback to props
    const displayData = campaignData ? {
        percentage: campaignData.discount_percentage,
        restaurantName: Helper.truncateText(campaignData.product?.name || "Restaurant", 20),
        image: campaignData.media_path || image,
        mediaType: campaignData.media_type,
        link: campaignData.product?.restaurant_id ? `/restaurants/${campaignData.product.restaurant_id}` : "#"
    } : {
        percentage,
        restaurantName: Helper.truncateText(restaurantName, 20),
        image,
        mediaType: "image", // Default to image for legacy props
        link
    };

    const handleClick = () => {
        // Track ad click if campaign data is available
        if (campaignData?.id) {
            trackAdClick(clickMutation, campaignData.id);
        }
    };

    return (
        <div className={`${backgroundColor} text-center pb-10`}>
            {displayData.mediaType === "video" ? (
                <video 
                    src={displayData.image} 
                    alt={displayData.restaurantName}
                    className="w-full h-auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                        // If video fails to load, show placeholder
                        e.target.style.display = 'none';
                        const placeholder = e.target.nextElementSibling;
                        if (placeholder) placeholder.style.display = 'block';
                    }}
                />
            ) : (
                <img 
                    src={displayData.image} 
                    alt={displayData.restaurantName}
                    onError={(e) => {
                        // If image fails to load, show placeholder
                        e.target.src = "/images/placeholder.jpg";
                    }}
                />
            )}
            
            {/* Placeholder image for video fallback */}
            {displayData.mediaType === "video" && (
                <img 
                    src="/images/placeholder.jpg" 
                    alt="Placeholder" 
                    className="w-full h-auto"
                    style={{ display: 'none' }}
                    onError={(e) => {
                        // If placeholder also fails, keep the original background
                        e.target.style.display = 'none';
                    }}
                />
            )}
            <div className="px-3">
                <h2 className={`${titleColor} font-semibold text-xl mb-4`}>
                    {title} {displayData.percentage}{titleSuffix}{" "}
                    <span className={restaurantNameColor}>
                        {displayData.restaurantName}
                    </span>
                </h2>
                <Link 
                    to={displayData.link} 
                    className={`${buttonTextColor} ${buttonBackgroundColor} block w-full py-2 rounded-full`}
                    onClick={handleClick}
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    )
}
