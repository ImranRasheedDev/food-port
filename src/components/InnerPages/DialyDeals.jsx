import React, { useState } from 'react'
import DialyDealsCard from '../Cards/DialyDealsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import SectionInfo from './SectionInfo';
import { useBannerAds } from '@/hooks/api';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';

const DialyDeals = () => {
    // Fetch ads for daily deals (position 1)
    const { data, isLoading } = useBannerAds();
    const campaigns = Array.isArray(data?.data) ? data.data : [];
    const navigate = useNavigate();
    console.log(campaigns, 'campaigns');

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const handleCardClick = async (campaign) => {
        const restaurantId = campaign?.restaurant?.id;
        const restaurantName = campaign?.restaurant?.name;
        const productId = campaign?.product?.id;

        // Priority: restaurant first
        if (restaurantId && productId) {
            navigate(`/resturants-detail/${restaurantId}`, { state: { productId } });
            return;
        }

        if (restaurantId && !productId) {
            navigate(`/resturants-detail/${restaurantId}`);
            return;
        }

        if (!restaurantId && productId) {
            setSelectedProductId(productId);
            setSelectedRestaurant(null);
            setIsProductModalOpen(true);
            return;
        }
    };


    return (
        <div>
            <SectionInfo title={"Daily Deals!"} description={"We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."} />

            <Swiper
                pagination={true}
                modules={[Pagination]}
                className="deals-swiper"
                spaceBetween={20}
                breakpoints={{
                    640: {
                        spaceBetween: 20,
                    },
                    768: {
                        spaceBetween: 30,
                    },
                }}
            >
                {campaigns.map((campaign, index) => (
                    <SwiperSlide key={campaign?.id || index}>
                        {/* <DialyDealsCard
                            campaignData={ad}
                            image={ad.media_path}
                            onImageError={() => handleImageError(ad.id || index)}
                            onCardClick={onCardClick}
                        /> */}
                        <div onClick={() => handleCardClick(campaign)} className='cursor-pointer rounded-4xl overflow-hidden h-64 md:h-96'>
                            <img src={campaign?.media_path || '/images/placeholder1.jpg'} alt={campaign?.restaurant?.name} className='w-full h-full object-cover' />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <ProductModal
                open={isProductModalOpen}
                setOpen={setIsProductModalOpen}
                productId={selectedProductId}
                restaurantData={selectedRestaurant}
            />
        </div>
    )
}

export default DialyDeals