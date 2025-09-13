const cuisineTypes = [
    { name: "All", image: "/images/all.jpg" },
    { name: "Breakfast", image: "/images/breakpast.jpg" },
    { name: "Lunch", image: "/images/lunch.jpg" },
    { name: "Supper", image: "/images/supper.jpg" },
    { name: "Dinner", image: "/images/dinner.jpg" },
    { name: "Mid Night", image: "/images/mid-night.jpg" },
]

export default function CuisineForYou() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        <span className="text-red-500">Cuisine</span> For You
                    </h2>
                    <p className="text-gray-600">Browse our top cuisine here to discover different food.</p>
                </div>

                <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {cuisineTypes.map((cuisine, index) => (
                        <div key={index} className="card-after relative text-center cursor-pointer hover:scale-105 transition-transform ">
                            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-4 border-white shadow-lg">
                                <img
                                    src={cuisine.image}
                                    alt={cuisine.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-primary-400 font-medium">{cuisine.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
