import React from 'react'
import { processImageUrl } from '@/lib/utils';

const DialyDealsCard = ({ campaignData, image, onImageError, onCardClick }) => {
    const handleClick = () => {
        if (onCardClick && campaignData) {
            onCardClick({
                productId: campaignData.product_id,
                restaurant: campaignData.restaurant || null,
            });
        }
    };

    return (
        <div
            className="rounded-xl h-[200px] md:h-[320px] cursor-pointer"
            onClick={handleClick}
        >
            <img
                src={processImageUrl(image)}
                alt="Daily Deal"
                className='block h-full w-full rounded-xl'
                onError={onImageError}
            />
        </div>
    )
}

export default DialyDealsCard