import LayoutWrapper from "@/components/layoutWrapper";

const steps = [
  { number: 1, title: "Upload Your Ad", description: "Upload an eye-catching image for your advertisement" },
  { number: 2, title: "Add Details", description: "Write a compelling headline and description" },
  { number: 3, title: "Set Location", description: "Choose where your ad will be shown" },
  { number: 4, title: "Make Payment", description: "Complete payment and your ad goes live" },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-white">
      <LayoutWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advertise Yourself and Boost Your Business
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Reach thousands of potential customers in your area. Our advertising platform helps restaurants, food trucks, and individuals promote their culinary offerings effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-50 rounded-2xl p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-orange-500 rounded-2xl rotate-12 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold -rotate-12">
                    #{step.number}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                #{step.number} {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </LayoutWrapper>
    </section>
  );
}
