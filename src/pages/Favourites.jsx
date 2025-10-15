import FavouritesResturants from "@/components/Cards/FavouritesResturants"
import FavouritesFoodTrucks from "@/components/InnerPages/FavouritesFoodTrucks"
import { useLikedRestaurants } from "@/hooks/api"

function Favourites() {
    const { data: likedRestaurantsData, isLoading, error } = useLikedRestaurants();

    return (
        <>
            <div className="h-[72px]" />
            <div className="container mx-auto mt-14">
                <FavouritesResturants />
                <div className="py-10">
                    <FavouritesFoodTrucks />
                </div>
            </div>
        </>
    )
}

export default Favourites