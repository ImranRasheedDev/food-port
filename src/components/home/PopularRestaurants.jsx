import { Button } from "@/components/ui/button"
import { Star, Heart, MapPin, Clock } from "lucide-react"
import { RestaurantCard } from "../Cards/PrimaryCard"

const restaurants = [
    {
        name: "KFC",
        description: "Chicken quesadilla, avocado...",
        rating: 3.2,
        image: "/kfc-chicken-burger.png",
        location: "California",
        distance: "1 km",
        time: "30 min",
    },
    {
        name: "Poultry Palace",
        description: "Chicken quesadilla, avocado...",
        rating: 3.8,
        image: "/pizza-with-toppings.png",
        location: "New Jersey",
        distance: "3.2 km",
        time: "25 min",
    },
    {
        name: "The Grill Master's Cafe",
        description: "Bread, Eggs, Butter, Fries...",
        rating: 4.3,
        image: "/grilled-sandwich-with-vegetables.png",
        location: "New York",
        distance: "5 km",
        time: "40 min",
    },
    {
        name: "Cozy Cuppa Cafe",
        description: "Cheesecake, waffles, Cakes...",
        rating: 3.8,
        image: "/coffee-and-cheesecake.png",
        location: "Dallas",
        distance: "4 km",
        time: "30 min",
    },
]

export default function PopularRestaurants() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Most Popular <span className="text-red-500">Restaurants</span>
                        </h2>
                        <p className="text-gray-600">Find nearby popular Restaurants.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {restaurants.map((restaurant, index) => (
                        <RestaurantCard description={restaurant.description} distance={restaurant.distance} image={restaurant.image} location={restaurant.location} name={restaurant.name} onFavoriteClick={() => { }} rating={restaurant.rating} time={restaurant.time} key={index} />
                        // <div
                        //     key={index}
                        //     className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        // >
                        //     <div className="relative">
                        //         <img
                        //             src={restaurant.image || "/placeholder.svg"}
                        //             alt={restaurant.name}
                        //             className="w-full h-48 object-cover"
                        //         />
                        //         <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                        //             <Heart className="w-4 h-4 text-gray-400" />
                        //         </button>
                        //     </div>
                        //     <div className="p-4">
                        //         <div className="flex items-center justify-between mb-2">
                        //             <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        //             <div className="flex items-center space-x-1">
                        //                 <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        //                 <span className="text-sm text-gray-600">{restaurant.rating}</span>
                        //             </div>
                        //         </div>
                        //         <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
                        //         <div className="flex items-center justify-between text-sm text-gray-500">
                        //             <div className="flex items-center space-x-1">
                        //                 <MapPin className="w-4 h-4 text-red-500" />
                        //                 <span>{restaurant.location}</span>
                        //             </div>
                        //             <div className="flex items-center space-x-3">
                        //                 <div className="flex items-center space-x-1">
                        //                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        //                     <span>{restaurant.distance}</span>
                        //                 </div>
                        //                 <div className="flex items-center space-x-1">
                        //                     <Clock className="w-4 h-4 text-red-500" />
                        //                     <span>{restaurant.time}</span>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full">
                        See All
                        <div className="ml-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                    </Button>
                </div>
            </div>
        </section>
    )
}
