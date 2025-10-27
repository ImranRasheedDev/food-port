import { Star } from "lucide-react";
import { Progress } from "../ui/progress";

export default function TotalTestimonialsBox({ rating = 0, customerCount, ratingData = [] }) {
    // Function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        // Render full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="#EEEEEE"
                    viewBox="0 0 16 17"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.884 12.785 4.89 14.37a.493.493 0 0 1-.718-.525l.572-3.353a.25.25 0 0 0-.07-.22L2.248 7.896a.5.5 0 0 1 .274-.848l3.35-.49a.25.25 0 0 0 .185-.135L7.556 3.37a.493.493 0 0 1 .887 0l1.498 3.052a.25.25 0 0 0 .186.136l3.349.489a.497.497 0 0 1 .274.848l-2.423 2.375a.25.25 0 0 0-.071.22l.572 3.353a.497.497 0 0 1-.718.525l-2.995-1.584a.25.25 0 0 0-.23 0"
                        clipRule="evenodd"
                    />
                </svg>
            );
        }

        // Render half star if needed
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative inline-block">
                    {/* Transparent star background */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="transparent"
                        stroke="#EEEEEE"
                        viewBox="0 0 16 17"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.884 12.785 4.89 14.37a.493.493 0 0 1-.718-.525l.572-3.353a.25.25 0 0 0-.07-.22L2.248 7.896a.5.5 0 0 1 .274-.848l3.35-.49a.25.25 0 0 0 .185-.135L7.556 3.37a.493.493 0 0 1 .887 0l1.498 3.052a.25.25 0 0 0 .186.136l3.349.489a.497.497 0 0 1 .274.848l-2.423 2.375a.25.25 0 0 0-.071.22l.572 3.353a.497.497 0 0 1-.718.525l-2.995-1.584a.25.25 0 0 0-.23 0"
                            clipRule="evenodd"
                        />
                    </svg>
                    {/* Half filled star overlay */}
                    <div
                        className="absolute top-0 left-0 overflow-hidden"
                        style={{ width: '50%', height: '30px' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="#EEEEEE"
                            viewBox="0 0 16 17"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.884 12.785 4.89 14.37a.493.493 0 0 1-.718-.525l.572-3.353a.25.25 0 0 0-.07-.22L2.248 7.896a.5.5 0 0 1 .274-.848l3.35-.49a.25.25 0 0 0 .185-.135L7.556 3.37a.493.493 0 0 1 .887 0l1.498 3.052a.25.25 0 0 0 .186.136l3.349.489a.497.497 0 0 1 .274.848l-2.423 2.375a.25.25 0 0 0-.071.22l.572 3.353a.497.497 0 0 1-.718.525l-2.995-1.584a.25.25 0 0 0-.23 0"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            );
        }

        // Render empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg
                    key={`empty-${i}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="transparent"
                    stroke="#EEEEEE"
                    strokeWidth="1"
                    viewBox="0 0 16 17"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.884 12.785 4.89 14.37a.493.493 0 0 1-.718-.525l.572-3.353a.25.25 0 0 0-.07-.22L2.248 7.896a.5.5 0 0 1 .274-.848l3.35-.49a.25.25 0 0 0 .185-.135L7.556 3.37a.493.493 0 0 1 .887 0l1.498 3.052a.25.25 0 0 0 .186.136l3.349.489a.497.497 0 0 1 .274.848l-2.423 2.375a.25.25 0 0 0-.071.22l.572 3.353a.497.497 0 0 1-.718.525l-2.995-1.584a.25.25 0 0 0-.23 0"
                        clipRule="evenodd"
                    />
                </svg>
            );
        }

        return stars;
    };

    return (
        <div className="flex items-center w-full gap-4 ">
            <div className="bg-primary-50 p-8 rounded-lg text-center w-1/2">
                <h3 className="text-white text-[56px] font-semibold" >
                    {rating}
                </h3>
                <div className="flex items-center gap-1 mt-2 justify-center">
                    {renderStars(rating)}
                </div>
                <p className="font-medium text-primary-1021 mt-2">Customer Rating  ({customerCount})</p>
            </div>
            <div className="w-full space-y-4">
                {
                    Array.from({ length: 5 }).map((_, index) => {
                        const currentRatingData = ratingData[index] || { percentage: 0, count: 0 };
                        return (
                            <div key={index} className="flex items-center gap-2 w-full">
                                <div className="flex items-center gap-x-1">
                                    {
                                        Array.from({ length: 5 }).map((_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className={`w-4 h-4 ${starIndex < (5 - index)
                                                    ? 'fill-primary-1018 text-primary-1018'
                                                    : 'text-primary-1023'
                                                    }`}
                                            />
                                        ))
                                    }
                                </div>
                                <div className="w-[60%]">
                                    <Progress value={currentRatingData.percentage} className="w-full h-4 bg-primary-1020 [&>div]:bg-primary-1018" />
                                </div>
                                <div className="w-[40%]">
                                    <p className="text-primary-1022">{currentRatingData.percentage}% <span className="text-primary-1019"> ({currentRatingData.count.toLocaleString()})</span> </p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}