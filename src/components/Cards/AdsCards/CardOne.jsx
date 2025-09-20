import { Link } from "react-router-dom";

export default function CardOne({
    percentage,
    restaurantName,
    title = "Make Your First Order and Get",
    titleSuffix = "% Off From",
    image = "/images/add-card-one.png",
    backgroundColor = "bg-primary-950",
    titleColor = "text-white",
    restaurantNameColor = "text-primary-1002",
    buttonText = "Order Now",
    buttonTextColor = "text-primary-1002",
    buttonBackgroundColor = "bg-white",
    link = "#"
}) {
    return (
        <div className={`${backgroundColor} text-center pb-10`}>
            <img src={image} alt={restaurantName} />
            <div className="px-3">
                <h2 className={`${titleColor} font-semibold text-xl mb-4`}>
                    {title} {percentage}{titleSuffix}{" "}
                    <span className={restaurantNameColor}>
                        {restaurantName}
                    </span>
                </h2>
                <Link to={link} className={`${buttonTextColor} ${buttonBackgroundColor} block w-full py-2 rounded-full`}>
                    {buttonText}
                </Link>
            </div>
        </div>
    )
}
