import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";

function CookiePolicy() {
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
                                Cookie Policy
                            </h1>
                            <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Learn how FoodPort uses cookies and similar technologies on our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <LayoutWrapper>
                    <h2 className="text-4xl font-bold text-primary-900 mb-4">
                        Cookie <span className="text-primary-50">Policy</span>
                    </h2>
                    <p className="text-gray-600 mb-8">
                        <strong>Effective Date:</strong> January 5, 2026 | <strong>Last Updated:</strong> January 5, 2026
                    </p>
                    <div className="text-gray-700 leading-relaxed space-y-8">
                        <p>
                            This Cookie Policy explains how FoodPort ("we," "our," or "us") uses cookies and similar technologies on our website and digital platforms. It describes what cookies are, how we use them, and how you can manage or control your cookie preferences.
                        </p>
                        <p>
                            By using our website, you consent to the use of cookies in accordance with this policy.
                        </p>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">1. What Are Cookies?</h3>
                            <p>
                                Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember preferences, and analyze user interactions.
                            </p>
                            <p>Cookies may include:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Session Cookies:</strong> Deleted automatically when you close your browser.</li>
                                <li><strong>Persistent Cookies:</strong> Stored on your device until they expire or are manually deleted.</li>
                                <li><strong>First-Party Cookies:</strong> Set directly by FoodPort.</li>
                                <li><strong>Third-Party Cookies:</strong> Set by external services we integrate (e.g., analytics or advertising partners).</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">2. How We Use Cookies</h3>
                            <p>FoodPort uses cookies to enhance your browsing experience and improve our services. We use them for:</p>

                            <h4 className="text-lg font-semibold text-primary-900">Essential Cookies</h4>
                            <p>
                                Required for basic site functions such as navigation, user login, and secure access to account areas.
                            </p>
                            <p className="text-gray-600 italic">
                                Example: Managing sessions, remembering login states, and enabling platform security.
                            </p>

                            <h4 className="text-lg font-semibold text-primary-900">Performance & Analytics Cookies</h4>
                            <p>
                                Used to understand how visitors interact with our site, helping us improve design, functionality, and user experience.
                            </p>
                            <p className="text-gray-600 italic">
                                Examples: Google Analytics or similar traffic tracking tools.
                            </p>

                            <h4 className="text-lg font-semibold text-primary-900">Functionality Cookies</h4>
                            <p>
                                Enable the site to remember user preferences such as language, location, and display settings for a personalized experience.
                            </p>

                            <h4 className="text-lg font-semibold text-primary-900">Advertising & Marketing Cookies</h4>
                            <p>
                                Used by FoodPort and approved partners (including advertisers) to deliver relevant promotions and measure campaign performance without sharing personally identifiable information.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">3. Third-Party Cookies</h3>
                            <p>
                                Some cookies are set by trusted third-party partners who help us analyze performance, deliver ads, or integrate services. These include, but are not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Google Analytics</li>
                                <li>Meta (Facebook) Ads</li>
                                <li>LinkedIn Insights</li>
                                <li>Service or logistics integration tools</li>
                            </ul>
                            <p>
                                We do not control third-party cookies. For detailed information, please review the privacy and cookie policies of these third parties directly.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">4. How to Manage or Disable Cookies</h3>
                            <p>You can manage cookies through your browser or device settings:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Accept or reject cookies:</strong> Adjust settings via the on-site cookie banner or browser configuration.</li>
                                <li><strong>Delete stored cookies:</strong> Clear your browser history and cookie storage periodically.</li>
                                <li><strong>Opt-out of analytics or ads:</strong> Visit Google Ads Settings or use tools like Your Ad Choices.</li>
                            </ul>
                            <p>
                                <strong>Please note:</strong> Disabling certain cookies may affect site functionality or limit your experience on FoodPort.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">5. Do Not Track (DNT) Signals</h3>
                            <p>
                                Some browsers offer a "Do Not Track" feature. While we respect user privacy, FoodPort does not currently respond to DNT signals due to the lack of a consistent industry standard. We will update this policy if this changes.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">6. Policy Updates</h3>
                            <p>
                                We may update this Cookie Policy periodically to reflect changes in our cookie usage, services, or legal requirements. Updates will be posted with a revised "Last Updated" date. Continued use of our website indicates acceptance of the latest policy.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">7. Contact Us</h3>
                            <p>If you have any questions or concerns about this Cookie Policy, please contact our Privacy Team:</p>
                            <p>
                                <strong>FoodPort Privacy Team</strong><br />
                                📧 privacy@foodport.com
                            </p>
                        </div>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}
export default CookiePolicy;
