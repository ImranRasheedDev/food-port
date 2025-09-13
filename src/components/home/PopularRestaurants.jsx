import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { RestaurantCard } from "../Cards/PrimaryCard"

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
]

export default function PopularRestaurants({ user = false }) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Most Popular <span className="text-primary-50">Restaurants</span>
                        </h2>
                        <p className="text-gray-600">Find nearby popular Restaurants.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {
                        user ? <>
                            {restaurants.slice(0, 8).map((restaurant, index) => (
                                <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                            ))}

                        </> : <>
                            {restaurants.slice(0, 4).map((restaurant, index) => (
                                <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                            ))}
                        </>
                    }
                </div>

                <div className="text-center">
                    <Button className="bg-primary-50 hover:bg-red-600 text-white px-10 h-12 rounded-full shadow-lg cursor-pointer">
                        See All
                        <span className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-center">
                            <ChevronRight className="w-4 h-4 stroke-primary-50 " />
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    )
}
