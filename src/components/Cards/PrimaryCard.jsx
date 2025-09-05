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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={image || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-48 object-cover"
                />
                <button
                    onClick={onFavoriteClick}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                    <Heart className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{rating}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{location}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>{distance}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
