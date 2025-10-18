import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdClickMutation } from "@/hooks/api";
import Helper from "@/helpers";
import { isValidUrl } from "@/lib/inValidUrl";

const DealDiscountCard = ({ 
    // Dynamic banner data
    campaignData,
    // Legacy props for backward compatibility
    title, 
    companyName, 
    link, 
    cardIndex = 0 
}) => {
    const navigate = useNavigate();
    const clickMutation = useAdClickMutation(campaignData?.id);
    const [imageError, setImageError] = useState(false);

    // Use campaign data if available, otherwise fallback to props
    const displayData = campaignData ? {
        title: `Make Your First Order and Get ${campaignData.discount_percentage}% Off From`,
        companyName: Helper.truncateText(campaignData.product?.name || "Restaurant", 25),
        mediaPath: campaignData.media_path,
        mediaType: campaignData.media_type,
        link: campaignData.product?.restaurant_id  && campaignData.product.id ?  `/${campaignData.product.restaurant_id}` : "#"
    } : {
        title,
        companyName: Helper.truncateText(companyName, 25),
        mediaPath: null,
        mediaType: "image",
        link
    };

    // Determine card style based on index (cycles through 0, 1, 2)
    const styleIndex = cardIndex % 3;

    // Card style configurations
    const cardStyles = {
        0: { // First card
            containerClass: 'bg-[url("/images/deal-bg-1.png")]',
            titleClass: 'text-white',
            companyClass: 'text-primary-1002',
            buttonClass: 'bg-white text-primary-1004'
        },
        1: { // Second card
            containerClass: 'bg-[url("/images/deal-bg-3.png")]',
            titleClass: 'text-white',
            companyClass: 'text-primary-1002',
            buttonClass: 'bg-primary-50 text-white'
        },
        2: { // Third card
            containerClass: 'bg-[url("/images/deal-bg-2.png")]',
            titleClass: 'text-white',
            companyClass: 'text-white',
            buttonClass: 'bg-black text-white'
        }
    };

    const currentStyle = cardStyles[styleIndex];

    const handleClick = (e) => {
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
        // Legacy: if no campaign data, navigate only if link valid is handled by navigate call below
        if (displayData.link && displayData.link !== '#') {
            navigate(displayData.link);
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // Validate mediaPath for background image
    const validMediaPath = displayData.mediaPath && 
        displayData.mediaType === "image" && 
        isValidUrl(displayData.mediaPath) && 
        !imageError ? displayData.mediaPath : null;

    return (
        <div className={`text-white items-center flex rounded-sm bg-cover bg-center bg-no-repeat relative overflow-hidden`}
             style={validMediaPath ? {
                 backgroundImage: `url(${validMediaPath})`
             } : undefined}>
            
            {/* Show video if media type is video */}
            {displayData.mediaType === "video" && displayData.mediaPath && (
                <video 
                    className="absolute inset-0 w-full h-full object-cover z-0"
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
                >
                    <source src={displayData.mediaPath} type="video/mp4" />
                </video>
            )}
            
            {/* Show placeholder image if video fails to load or no media */}
            {(!displayData.mediaPath || displayData.mediaType === "video") && (
                <img 
                    src="/images/placeholder.jpg" 
                    alt="Placeholder" 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ display: displayData.mediaType === "video" && displayData.mediaPath ? 'none' : 'block' }}
                    onError={(e) => {
                        // If placeholder also fails, show background
                        e.target.style.display = 'none';
                        const background = e.target.nextElementSibling;
                        if (background) background.style.display = 'block';
                    }}
                />
            )}
            
            {/* Use background class as final fallback */}
            <div className={`absolute inset-0 ${currentStyle.containerClass}`} style={{ display: displayData.mediaPath && displayData.mediaType === "image" ? 'none' : 'block' }}></div>
            
            {/* Content overlay */}
            <div className='pl-4 w-[64%] py-6 relative z-10'>
                <h3 className='text-lg leading-5 font-bold mb-3'>
                    <span className={currentStyle.titleClass}>{displayData.title}</span> <span className={currentStyle.companyClass}>{displayData.companyName}</span>
                </h3>
                <button
                    className={`${currentStyle.buttonClass} rounded-4xl inline-block px-6 py-2 font-medium text-sm`}
                    onClick={handleClick}
                >
                    Order Now
                </button>
            </div>
        </div>
    )
}

export default DealDiscountCard