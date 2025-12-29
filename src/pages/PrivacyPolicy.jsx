import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="h-[72px]" />
      <section
        className={`bg-[url('/images/hero-bg-2.png')] h-[250px] sm:h-[400px] md:h-[250px] relative flex items-center justify-start bg-cover bg-center`}
      >
        <div className="absolute bottom-0 right-0 ml-auto text-right hidden sm:block">
          <img src={processImageUrl("/images/about-banner.png")} className="w-full h-full object-cover" alt="Inner Banner" />
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-[1280px] mx-auto">
            <div>
              <h1 className="lg:text-5xl text-2xl font-bold text-white mb-6 leading-tight uppercase">
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base  text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with <br />
                established players. They needed to attract the hungry foodies, restaurant and food truck owners.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <LayoutWrapper>
          <h2 className="text-4xl font-bold text-primary-900 mb-8">
            Privacy <span className="text-primary-50">Policy</span>
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              We're committed to cook healthy to ensure they retain their freshness and nutritional
              value, guaranteeing a delightful experience.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.

            </p>
          </div>
        </LayoutWrapper>
      </section>
    </>
  );
}
