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
                            <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Your privacy matters to us. Learn how we collect, use, and protect your information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <LayoutWrapper>
                    <h2 className="text-4xl font-bold text-primary-900 mb-4">
                        Privacy <span className="text-primary-50">Policy</span>
                    </h2>
                    <p className="text-gray-600 mb-8">
                        <strong>Effective Date:</strong> January 5, 2026 | <strong>Last Updated:</strong> January 5, 2026
                    </p>
                    <div className="text-gray-700 leading-relaxed space-y-8">
                        <p>
                            At FoodPort, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our platform.
                        </p>
                        <p>
                            By accessing or using FoodPort's website or services, you agree to the practices described in this Privacy Policy.
                        </p>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">1. Information We Collect</h3>
                            <p>We collect information to operate effectively, improve our services, and provide a personalized user experience.</p>

                            <h4 className="text-lg font-semibold text-primary-900">a. Information You Provide Directly</h4>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name, business name, and contact details (such as email address, phone number, and mailing address)</li>
                                <li>Account registration details and login credentials</li>
                                <li>Communication preferences and correspondence with us</li>
                                <li>Payment and billing information when using paid services</li>
                                <li>Feedback, support requests, and other information you voluntarily submit</li>
                            </ul>

                            <h4 className="text-lg font-semibold text-primary-900">b. Information Collected Automatically</h4>
                            <p>When you visit our website or use the Platform, we may automatically collect:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Device and browser information</li>
                                <li>IP address and approximate location data</li>
                                <li>Usage data (pages visited, actions taken, and time spent)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h4 className="text-lg font-semibold text-primary-900">c. Information from Third Parties</h4>
                            <p>We may receive information from:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Partner platforms, service providers, and advertisers</li>
                                <li>Public databases or marketing affiliates, where permitted by law</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">2. How We Use Your Information</h3>
                            <p>We use personal information to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide, operate, and maintain FoodPort's services</li>
                                <li>Improve functionality, performance, and user experience</li>
                                <li>Process payments, subscriptions, and transactions</li>
                                <li>Communicate service updates, promotional messages, or support responses</li>
                                <li>Protect against fraud, unauthorized access, and security risks</li>
                                <li>Comply with legal obligations and enforce our Terms and Conditions</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">3. How We Share Information</h3>
                            <p><strong>FoodPort does not sell your personal information.</strong></p>
                            <p>We may share your information with:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Service Providers:</strong> Trusted third parties that support our operations (such as hosting, analytics, and payment processing)</li>
                                <li><strong>Business Partners:</strong> Restaurants, food trucks, suppliers, advertisers, and others who collaborate within the FoodPort network</li>
                                <li><strong>Legal Authorities:</strong> When required by law, court order, or to protect the rights, safety, or property of FoodPort or others</li>
                            </ul>
                            <p>All third parties are required to protect your data in accordance with this Privacy Policy and applicable laws.</p>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">4. Cookies and Tracking Technologies</h3>
                            <p>FoodPort uses cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Enable essential site functionality</li>
                                <li>Analyze performance and usage trends</li>
                                <li>Personalize content and advertising</li>
                            </ul>
                            <p>You can control or disable cookies through your browser settings; however, doing so may limit certain features or functionality of the Platform.</p>
                        </div>

                        {/* Section 5 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">5. Data Retention</h3>
                            <p>We retain personal information only for as long as necessary to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Fulfill the purposes described in this Privacy Policy</li>
                                <li>Meet legal, regulatory, or contractual obligations</li>
                                <li>Resolve disputes and enforce agreements</li>
                            </ul>
                            <p>When personal data is no longer required, it is securely deleted or anonymized.</p>
                        </div>

                        {/* Section 6 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">6. Data Security</h3>
                            <p>
                                We implement reasonable administrative, technical, and physical safeguards — including encryption, secure servers, and access controls — to protect your personal information.
                            </p>
                            <p>
                                However, no system is completely secure, and we cannot guarantee absolute security of your data.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">7. Your Rights and Choices</h3>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access and obtain a copy of your personal data</li>
                                <li>Correct or update inaccurate information</li>
                                <li>Request deletion or restriction of your data</li>
                                <li>Opt out of marketing communications</li>
                            </ul>
                            <p>To exercise these rights, please contact us at privacy@foodport.com.</p>
                        </div>

                        {/* Section 8 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">8. International Data Transfers</h3>
                            <p>
                                If you access FoodPort from outside the United States, your information may be transferred to and processed on servers located in the United States, where data protection laws may differ.
                            </p>
                            <p>
                                We take reasonable measures to ensure your data remains protected during such transfers.
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">9. Children's Privacy</h3>
                            <p>
                                FoodPort is intended for business and professional use only. We do not knowingly collect personal information from individuals under the age of 18.
                            </p>
                            <p>
                                If we become aware that personal information from a minor has been collected, we will promptly delete it.
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">10. Links to Third-Party Websites</h3>
                            <p>
                                Our Platform may contain links to third-party websites or services. FoodPort is not responsible for the privacy practices, content, or data handling of these external sites.
                            </p>
                            <p>
                                We encourage you to review their privacy policies before providing personal information.
                            </p>
                        </div>

                        {/* Section 11 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">11. Updates to This Privacy Policy</h3>
                            <p>
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
                            </p>
                            <p>
                                Continued use of FoodPort after changes are posted constitutes acceptance of the updated Privacy Policy.
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">12. Contact Us</h3>
                            <p>If you have questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
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
