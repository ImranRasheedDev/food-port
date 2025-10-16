import FavouritesResturants from "@/components/Cards/FavouritesResturants"
import FavouritesFoodTrucks from "@/components/InnerPages/FavouritesFoodTrucks"

function Favourites() {

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