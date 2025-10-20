import { useState } from "react";
import { processImageUrl } from "@/lib/utils";

export default function ProductCard({ title, price, description, image, onClick }) {
    const [imageError, setImageError] = useState(false);
    
    // Validate and process image URL
    const imageSrc = (() => {
        if (imageError) {
            return "/images/placeholder.jpg"; // Fallback image
        }
        return processImageUrl(image, "/images/placeholder.jpg");
    })();

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div onClick={onClick} className="border cursor-pointer border-primary-1007 rounded-lg p-4 flex justify-between items-center gap-4">
            <div>
                <h2 className="font-bold mb-2">{title}</h2>
                <p className="mb-2">from $ {price}</p>
                <p className=" text-primary-1013 line-clamp-2">{description}</p>
            </div>
            <div className="w-32 h-32 flex-shrink-0 relative" >
                <img 
                    src={imageSrc} 
                    alt="product-card" 
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={handleImageError}
                    loading="lazy"
                />
                <div className="absolute bottom-0 right-0">
                    <img src="/images/add-cart-button.png" alt="product-card" />
                </div>
            </div>
        </div>
    )
}