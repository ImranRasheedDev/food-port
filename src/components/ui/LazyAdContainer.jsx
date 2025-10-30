import React, { useState, useRef, useEffect } from 'react';
import CardOne from '@/components/Cards/AdsCards/CardOne';
import DealDiscountCard from '@/components/Cards/DealDiscountCard';

const LazyAdContainer = ({ 
  ads, 
  isLoading, 
  hasMore, 
  containerRef, 
  loadingRef, 
  onCardClick,
  staticImages = [],
  type = 'mixed', // 'card', 'deal', 'mixed'
  ...props 
}) => {
  const [visibleAds, setVisibleAds] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  // Show ads progressively as they load
  useEffect(() => {
    if (ads.length > 0) {
      setVisibleAds(ads);
    }
  }, [ads]);

  // Handle image error
  const handleImageError = (adId) => {
    setImageErrors(prev => ({
      ...prev,
      [adId]: true
    }));
  };

  // Get image source with fallback
  const getImageSrc = (ad, index) => {
    const adId = ad.id || index;
    if (imageErrors[adId] || !ad.image) {
      return staticImages[index % staticImages.length] || '/images/placeholder1.jpg';
    }
    return ad.image || staticImages[index % staticImages.length] || '/images/placeholder1.jpg';
  };

  // Render ad based on type
  const renderAd = (ad, index) => {
    const imageSrc = getImageSrc(ad, index);
    
    if (type === 'card') {
      return (
        <CardOne
          key={ad.id || index}
          campaignData={ad}
          image={imageSrc}
          onCardClick={onCardClick}
          onImageError={() => handleImageError(ad.id || index)}
          {...props}
        />
      );
    }
    
    if (type === 'deal') {
      return (
        <DealDiscountCard
          key={ad.id || index}
          campaignData={ad}
          cardIndex={index}
          onCardClick={onCardClick}
          image={imageSrc}
          onImageError={() => handleImageError(ad.id || index)}
          {...props}
        />
      );
    }
    
    // Mixed type - alternate between card and deal
    if (index % 3 === 0) {
      return (
        <CardOne
          key={ad.id || index}
          campaignData={ad}
          image={imageSrc}
          onCardClick={onCardClick}
          onImageError={() => handleImageError(ad.id || index)}
          {...props}
        />
      );
    } else {
      return (
        <DealDiscountCard
          key={ad.id || index}
          campaignData={ad}
          cardIndex={index}
          onCardClick={onCardClick}
          image={imageSrc}
          onImageError={() => handleImageError(ad.id || index)}
          {...props}
        />
      );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="space-y-6"
    >
      {/* Render visible ads */}
      {visibleAds.map((ad, index) => (
        <div key={ad.id || index} className="mb-6">
          {renderAd(ad, index)}
        </div>
      ))}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-50"></div>
        </div>
      )}
      
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadingRef} className="h-4"></div>
      )}
      
      {/* No more ads message */}
      {!hasMore && visibleAds.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          
        </div>
      )}
    </div>
  );
};

export default LazyAdContainer;
