// import { MapPin, ChefHat, CreditCard, UtensilsCrossed } from "lucide-react"
import LayoutWrapper from "../layoutWrapper";
import { processImageUrl } from '@/lib/utils';
const features = [
    {
        img: "/images/location.png",
        title: "#1 Select location",
        description: "Choose the location where your food will be delivered.",
    },
    {
        img: "/images/order.png",
        title: "#2 Choose order",
        description: "Check over hundreds of menus to pick your favorite food.",
    },
    {
        img: "/images/pay.png",
        title: "#3 Pay",
        description: "It's quick, safe, and simple. Select several methods of payment.",
    },
    {
        img: "/images/enjoy.png",
        title: "#4 Enjoy meals",
        description: "Food is made for you and ready to pickup.",
    },
]

export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-slate-50">
            <LayoutWrapper>
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-primary-400 mb-4">
                        Why Choose us for Your <span className="text-primary-50">Healthy</span> Food
                    </h2>
                    <p className="text-primary-400 max-w-2xl">
                        We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a
                        delightful experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="border border-b-gray-300 rounded-2xl p-10">
                            <div className="w-32 h-32 text-center mb-5">
                                <img src={processImageUrl(feature.img)} alt={feature.title || "Why Choose Us"} className="max-w-full " />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-primary-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </LayoutWrapper>
        </section>
    )
}
