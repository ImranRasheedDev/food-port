import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";

const businessBenefits = [
  "Reach thousands of hungry customers in your area",
  "Increase foot traffic and online orders",
  "Build brand awareness and loyalty",
  "Track performance with detailed analytics",
];

export default function BusinessOwnerSection() {
  return (
    <section className="py-16 bg-white">
      <LayoutWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={processImageUrl("/images/advertisement-business.jpg")}
              alt="Business Owner"
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop";
              }}
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advertise Yourself As A Business Owner
            </h2>
            <p className="text-gray-600 mb-6">
              Take your restaurant or food truck to the next level with targeted advertising. Reach hungry customers actively looking for great food in your area.
            </p>
            <ul className="space-y-3">
              {businessBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary-50 mt-2 flex-shrink-0" />
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
