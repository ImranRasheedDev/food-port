import FavouritesResturants from "@/components/Cards/FavouritesResturants"
import FavouritesFoodTrucks from "@/components/InnerPages/FavouritesFoodTrucks"
import LayoutWrapper from "@/components/layoutWrapper"

function Favourites() {

    return (
        <>
            <div className="h-[72px]" />
            <LayoutWrapper>
            <div className="mt-14">
                <FavouritesResturants />
                <div className="py-10">
                    <FavouritesFoodTrucks />
                </div>
            </div>
            </LayoutWrapper>
        </>
    )
}

export default Favourites