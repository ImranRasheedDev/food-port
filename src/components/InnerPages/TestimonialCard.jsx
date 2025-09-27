import { StarIcon } from "lucide-react";

export default function TestimonialCard({ img, name, description, date, rating }) {
    return (
        <div className="not-last:border-b border-primary-1020 pb-6">
            <div className="flex gap-4">
                <div className="">
                    <img src={img} alt="testimonial-card" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div>
                    <h3 className="text-lg text-primary-1008 font-medium">{name} <span className="text-primary-1019 text-[15px]">• {date}</span>  </h3>
                    <div className="flex gap-1">
                        {
                            Array.from({ length: rating }).map((_, index) => (
                                <StarIcon className="fill-primary-1018 text-primary-1018 w-4 h-4" key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>
            <p className="text-primary-1008 pt-4">{description}</p>
        </div>
    )
}