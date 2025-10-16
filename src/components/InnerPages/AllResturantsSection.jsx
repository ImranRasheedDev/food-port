import React, { useState, useEffect } from 'react'
import SectionInfo from './SectionInfo'
import { RestaurantCard } from '../Cards/PrimaryCard'
import { useRestaurants, useAllAddresses } from '@/hooks/api'
import { SkeletonCard } from '@/components/ui/skeleton'
import { NoData } from '@/components/ui/empty'
import DealsAndDiscounts from './DealsAndDiscounts'
import Pagination from '@/components/ui/pagination'

// Sample data for fallback
const sampleRestaurants = [
    {
        name: "KFC",
        description: "Chicken quesadilla, avocado...",
        rating: 3.2,
        image: "/images/popular-1.png",
        location: "California",
        distance: "1 km",
        time: "30 min",
    },
    {
        name: "Poultry Palace",
        description: "Chicken quesadilla, avocado...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "New Jersey",
        distance: "3.2 km",
        time: "25 min",
    },
    {
        name: "The Grill Master's Cafe",
        description: "Bread, Eggs, Butter, Fries...",
        rating: 4.3,
        image: "/images/popular-1.png",
        location: "New York",
        distance: "5 km",
        time: "40 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
]

// Function to map API restaurant data to card format
async function mapApiRestaurantToCard(r, userLat, userLng) {
    let distance = "-";
    let time = "-";
    let city = r.address || r.type || "-";

    if (r.coordinates?.latitude && r.coordinates?.longitude) {
        try {
            const info = await window.helper.getLocationDetails(
                r.coordinates.latitude,
                r.coordinates.longitude,
                userLat, // user current lat
                userLng // user current lng
            );
            distance = info.distance;
            time = info.duration;
            city = info.city;
        } catch (error) {
            console.error('Error getting location details:', error);
        }
    }

    return {
        key: r.id,
        id: r.id,
        name: r.name,
        description:
            (r.restaurant_categories &&
                r.restaurant_categories.map((c) => c.name).join(", ")) ||
            r.address ||
            "No description",
        image: r.bg_image_url || r.logo_url || "/images/popular-1.png",
        location: city,
        distance,
        time,
        rating: r.rating || 0,
        onFavoriteClick: () => {},
        link: `/resturants-detail/${r.id}`,
    };
}

const AllResturantsSection = ({ filters = {} }) => {
    // Check if user is logged in
    const isUserLoggedIn = window.lodash?.isEmpty(window.user) ? false : true;
    
    // Get user addresses to fetch default address coordinates (only if user is logged in)
    const { data: addresses } = useAllAddresses({
        enabled: isUserLoggedIn
    });
    
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(null);
    
    // Build API parameters based on filters
    const buildApiParams = () => {
        const params = {
            limit: 12, // Show 12 restaurants per page (6 + 6)
            page: currentPage,
        };

        // Handle suggested filters
        if (filters.suggested && filters.suggested.length > 0) {
            // Handle restaurants vs food trucks filter
            if (filters.suggested.includes('restaurants')) {
                params.moveable = "0";
            } else if (filters.suggested.includes('food-trucks')) {
                params.moveable = "1";
            }
            
            // Handle featured filter
            if (filters.suggested.includes('featured')) {
                params.featured = "1";
            }
            
            // Handle liked filter (if user is logged in)
            if (filters.suggested.includes('liked')) {
                params.liked = "1";
            }
        }

        // Handle categories
        if (filters.category && filters.category.length > 0) {
            params.category = filters.category;
        }

        // Handle price range
        if (filters.price_range) {
            params.price_range = filters.price_range;
        }

        // Handle distance
        if (filters.distance && filters.distance.length > 0) {
            // Map distance filters to actual distance values
            const distanceMap = {
                'driving': 5,
                'biking': 2,
                'walking': 1,
                'within-4-blocks': 0.25
            };
            const maxDistance = Math.max(...filters.distance.map(d => distanceMap[d] || 0));
            if (maxDistance > 0) {
                params.distance = maxDistance;
            }
        }

        // Handle search
        if (filters.search) {
            params.search = filters.search;
        }

        // Handle delivery address
        if (filters.delivery_address) {
            params.delivery_address = filters.delivery_address;
        }

        return params;
    };

    const apiParams = buildApiParams();
    const { data, isLoading } = useRestaurants(apiParams);
    
    // Get total count (without pagination) for display purposes
    const totalCountParams = { ...buildApiParams() };
    delete totalCountParams.limit;
    delete totalCountParams.page;
    totalCountParams.limit = 1000; // Get a large number to estimate total
    
    const { data: totalData } = useRestaurants(totalCountParams);
    
    const [restaurants, setRestaurants] = useState([]);
    const apiArray = data?.data;
    const hasApiData = apiArray && apiArray.length > 0;
    const apiReturnedEmpty = apiArray && apiArray.length === 0;
    
    // Calculate total count from the large dataset
    const estimatedTotal = totalData?.data?.length || null;
    
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

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);
    
    // Ensure currentPage doesn't exceed totalPages
    useEffect(() => {
        if (estimatedTotal && currentPage > 1) {
            const maxPages = Math.ceil(estimatedTotal / 12);
            if (currentPage > maxPages) {
                setCurrentPage(maxPages);
            }
        }
    }, [estimatedTotal, currentPage]);

    useEffect(() => {
        async function loadCards() {
            if (apiArray?.length > 0) {
                const cards = await Promise.all(
                    apiArray.map(
                        (r) => mapApiRestaurantToCard(r, userCoordinates.lat, userCoordinates.lng)
                    )
                );
                setRestaurants(cards);
            }
        }
        loadCards();
    }, [apiArray, userCoordinates.lat, userCoordinates.lng]);

    // Pagination functions
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of restaurants section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate pagination info - 12 items per page
    const itemsPerPage = 12;
    const currentDataCount = apiArray?.length || 0;
    const totalPages = estimatedTotal ? Math.ceil(estimatedTotal / itemsPerPage) : null;
    const hasPrevPage = currentPage > 1;
    const hasNextPage = totalPages ? (currentPage < totalPages) : (currentDataCount === itemsPerPage);
    
    // Show pagination when multiple pages exist (if known) or when prev/next is possible
    const showPagination = hasApiData && (
        (totalPages ? totalPages > 1 : (hasNextPage || hasPrevPage))
    );

    return (
        <div>
            {/* First Section - Show 6 cards */}
            <SectionInfo 
                title={"All Restaurants"} 
                description={"We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                ) : hasApiData ? (
                    restaurants.slice(0, 6).map((card) => (
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
                            link={card.link}
                        />
                    ))
                ) : apiReturnedEmpty ? (
                    <div className="col-span-full">
                        <NoData title="No Restaurants Found" />
                    </div>
                ) : (
                    // Fallback to sample data - show only 5
                    sampleRestaurants.slice(0, 6).map((restaurant, index) => (
                        <RestaurantCard 
                            key={index}
                            description={restaurant.description} 
                            distance={restaurant.distance} 
                            image={restaurant.image} 
                            location={restaurant.location} 
                            name={restaurant.name} 
                            onFavoriteClick={() => { }} 
                            rating={restaurant.rating} 
                            time={restaurant.time}
                            link={`/resturants-detail/${index + 1}`}
                        />
                    ))
                )}
            </div>

            {/* Deals and Discounts Section with next 5 restaurants */}
            <DealsAndDiscounts 
                restaurants={restaurants.slice(6, 12)} 
                isLoading={isLoading}
                hasApiData={hasApiData}
                apiReturnedEmpty={apiReturnedEmpty}
            />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                onPageChange={handlePageChange}
                showPagination={showPagination}
                currentDataCount={currentDataCount}
                itemsPerPage={itemsPerPage}
                totalCount={estimatedTotal}
            />
        </div>
    )
}

export default AllResturantsSection