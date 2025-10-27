import { StarIcon } from "lucide-react";
import { processImageUrl } from '@/lib/utils';
export default function TestimonialCard({ img, name, description, date, rating }) {
    // Format date to dd/month/year format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="not-last:border-b border-primary-1020 pb-6">
            <div className="flex gap-4">
                <div className="">
                    <img src={ processImageUrl(img) || "/public/images/avatar.jpg"} alt="testimonial-card" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div>
                    <h3 className="text-lg text-primary-1008 font-medium">{name} <span className="text-primary-1019 text-[15px]">• {formatDate(date)}</span>  </h3>
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