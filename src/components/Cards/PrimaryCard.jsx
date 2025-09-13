import { Heart, Star, MapPin, Clock } from "lucide-react";

export function RestaurantCard({
    image,
    name,
    rating,
    description,
    location,
    distance,
    time,
    onFavoriteClick,
}) {
    return (
        <div className="bg-white border border-primary-500 rounded-lg p-3 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-56 object-cover rounded-md"
                />
                <button
                    onClick={onFavoriteClick}
                    className="absolute top-3 right-3 p-1 cursor-pointer bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                    <Heart className="w-5 h-5 text-primary-50" />
                </button>
            </div>

            <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
                    <div className="flex items-center space-x-1">
                        <div className="w-6 h-6 rounded-full bg-yellow-400 text-white flex justify-center items-center">
                            <Star className="w-4 h-4" />

                        </div>
                        <span className="text-sm text-gray-600">{rating}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 border-b border-dashed border-primary-500 pb-4">{description}</p>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-primary-400">
                        <span className="w-2 h-2 flex bg-black rounded-full"></span>
                        <span>{location}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 border-r border-black/10 pr-4">
                            <span className="w-6 h-6 flex bg-primary-50 justify-center items-center rounded-full ">
                                <MapPin className="w-4 h-4  stroke-white" />
                            </span>
                            <span>{distance}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 flex bg-primary-50 justify-center items-center rounded-full ">
                                <Clock className="w-4 h-4 stroke-white" />
                            </span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
