import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";

const individualBenefits = [
  "Promote your home cooking or catering services",
  "Connect with local food enthusiasts",
  "Flexible pricing that fits your budget",
  "Easy-to-use platform with instant results",
];

export default function IndividualSection() {
  return (
    <section className="py-16 bg-gray-50">
      <LayoutWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advertise Yourself As An Individual
            </h2>
            <p className="text-gray-600 mb-6">
              Whether you're a home cook, caterer, or food enthusiast, showcase your culinary talents to a local audience eager to discover new flavors.
            </p>
            <ul className="space-y-3">
              {individualBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary-50 mt-2 flex-shrink-0" />
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden">
            <img
              src={processImageUrl("/images/advertisement-individual.jpg")}
              alt="Individual"
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop";
              }}
            />
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
