import React from 'react'
import SectionInfo from './SectionInfo'
import { RestaurantCard } from '../Cards/PrimaryCard'
const restaurants = [
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
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/images/popular-1.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
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
const FavouritesFoodTrucks = () => {
    return (
        <div>
            <SectionInfo title={"Food Trucks you like"} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {restaurants.slice(0, 4).map((restaurant, index) => (
                    <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                ))}
            </div>
        </div>
    )
}

export default FavouritesFoodTrucks