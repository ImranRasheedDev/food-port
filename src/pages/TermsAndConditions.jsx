import LayoutWrapper from "@/components/layoutWrapper";
import { processImageUrl } from "@/lib/utils";

function TermsAndConditions() {
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
                                Terms and Conditions
                            </h1>
                            <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 leading-relaxed">
                                Please read these Terms and Conditions carefully before using FoodPort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <LayoutWrapper>
                    <h2 className="text-4xl font-bold text-primary-900 mb-4">
                        Terms and <span className="text-primary-50">Conditions</span>
                    </h2>
                    <p className="text-gray-600 mb-8">
                        <strong>Effective Date:</strong> January 5, 2026 | <strong>Last Updated:</strong> January 5, 2026
                    </p>
                    <div className="text-gray-700 leading-relaxed space-y-8">
                        <p>
                            Welcome to FoodPort. These Terms and Conditions ("Terms") govern your access to and use of our website, mobile applications, and other digital services (collectively, the "Platform"). By accessing or using FoodPort, you agree to be bound by these Terms. Please read them carefully before using our services.
                        </p>
                        <p>
                            If you do not agree to these Terms, you must not access or use the Platform.
                        </p>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">1. About FoodPort</h3>
                            <p>
                                FoodPort is a digital platform that connects restaurants, food trucks, suppliers, distributors, advertisers, and other service providers within the food industry. We provide tools, integrations, and communication services designed to streamline operations, logistics, and growth opportunities among our partners.
                            </p>
                            <p>
                                FoodPort does not directly sell food or provide delivery services unless explicitly stated. We act solely as a facilitator between businesses and partners.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">2. Eligibility</h3>
                            <p>By using FoodPort, you represent and warrant that:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You are at least 18 years old and capable of entering into legally binding agreements.</li>
                                <li>You are using the Platform for lawful business purposes only.</li>
                                <li>All information you provide is accurate, current, and complete.</li>
                            </ul>
                            <p>
                                FoodPort reserves the right to deny access, suspend, or terminate accounts at its discretion if these Terms are violated or if the Platform is misused.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">3. Account Registration</h3>
                            <p>To access certain features, you may be required to create an account. You agree to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain the confidentiality of your login credentials.</li>
                                <li>Accept responsibility for all activities conducted under your account.</li>
                                <li>Notify FoodPort immediately of any unauthorized access or security breach.</li>
                            </ul>
                            <p>
                                FoodPort is not liable for any loss or damage resulting from unauthorized use of your account.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">4. Use of the Platform</h3>
                            <p>You agree to use the Platform only for lawful purposes. You must not:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Interfere with or disrupt the Platform's functionality.</li>
                                <li>Upload, post, or distribute unlawful, harmful, or malicious content.</li>
                                <li>Use the Platform to engage in fraudulent, deceptive, or misleading practices.</li>
                                <li>Copy, modify, reverse-engineer, or attempt to access the source code of any part of FoodPort's technology.</li>
                            </ul>
                            <p>
                                FoodPort reserves the right to monitor activity, remove content, and terminate access for prohibited behavior.
                            </p>
                        </div>

                        {/* Section 5 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">5. Fees and Payments</h3>
                            <p>
                                Certain FoodPort services may be subject to fees or subscription charges. You agree to pay all applicable charges associated with your selected plan or usage, including any required taxes. Payment terms, renewal conditions, and cancellation policies will be outlined in your service agreement or billing section.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">6. Partner and Advertiser Relationships</h3>
                            <p>
                                FoodPort may collaborate with third-party partners, service providers, or advertisers. While we strive to work with reputable partners, FoodPort is not responsible for the actions, content, products, or services provided by third parties. All engagements with third parties are at your own discretion and risk.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">7. Intellectual Property</h3>
                            <p>
                                All content, branding, software, and design elements available on the Platform are the exclusive property of FoodPort or its licensors and are protected by applicable intellectual property laws.
                            </p>
                            <p>
                                You may not reproduce, distribute, modify, or create derivative works without prior written permission from FoodPort. "FoodPort," its logos, and associated trademarks are owned by FoodPort.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">8. Privacy Policy</h3>
                            <p>
                                Your use of the Platform is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using FoodPort, you consent to these data practices.
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">9. Limitation of Liability</h3>
                            <p>To the maximum extent permitted by law:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>FoodPort shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of the Platform.</li>
                                <li>We do not guarantee uninterrupted, secure, or error-free operation of the Platform.</li>
                                <li>Your use of the Platform is at your own risk.</li>
                            </ul>
                            <p>
                                Some jurisdictions do not allow certain liability limitations, so these exclusions may not apply to you.
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">10. Indemnification</h3>
                            <p>
                                You agree to indemnify, defend, and hold harmless FoodPort, its affiliates, officers, employees, and partners from any claims, damages, losses, liabilities, or expenses (including legal fees) arising from:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your use of the Platform,</li>
                                <li>Your violation of these Terms, or</li>
                                <li>Your infringement of any third-party rights.</li>
                            </ul>
                        </div>

                        {/* Section 11 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">11. Modifications to the Terms</h3>
                            <p>
                                FoodPort reserves the right to modify or update these Terms at any time. Changes become effective immediately upon posting. Continued use of the Platform after updates constitutes acceptance of the revised Terms.
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">12. Termination</h3>
                            <p>
                                FoodPort may suspend or terminate your access to the Platform at any time, with or without notice, for violations of these Terms or misuse of the Platform. Upon termination, your right to use the Platform will immediately cease.
                            </p>
                        </div>

                        {/* Section 13 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">13. Governing Law</h3>
                            <p>
                                These Terms are governed by and construed in accordance with the laws of the State of Texas, without regard to conflict-of-law principles. Any disputes shall be resolved exclusively in the courts located in Dallas County, Texas.
                            </p>
                        </div>

                        {/* Section 14 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">14. Contact Us</h3>
                            <p>For questions regarding these Terms and Conditions, please contact:</p>
                            <p>
                                <strong>FoodPort Support Team</strong><br />
                                📧 support@foodport.com
                            </p>
                        </div>

                        {/* Section 15 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">15. Dispute Resolution and Arbitration</h3>
                            <p>
                                Any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Platform shall be resolved through binding arbitration, rather than in court, except that either party may seek injunctive or equitable relief in a court of competent jurisdiction.
                            </p>
                            <p>
                                Arbitration shall be conducted in accordance with the rules of the American Arbitration Association (AAA) and shall take place in Dallas County, Texas. Each party shall bear its own costs unless otherwise required by law.
                            </p>
                            <p>
                                <strong>Class Action Waiver:</strong> You agree that disputes will be resolved on an individual basis only. You waive any right to participate in a class, collective, or representative action against FoodPort.
                            </p>
                        </div>

                        {/* Section 16 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">16. User-Generated Content</h3>
                            <p>
                                The Platform may allow users to upload, submit, post, or share content, including text, images, listings, advertisements, or communications ("User Content").
                            </p>
                            <p>
                                By submitting User Content, you grant FoodPort a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, modify, distribute, and promote such content in connection with operating and marketing the Platform.
                            </p>
                            <p>
                                You represent that you own or have the necessary rights to submit User Content and that such content does not violate any laws or third-party rights. FoodPort reserves the right to remove or restrict any User Content at its sole discretion.
                            </p>
                        </div>

                        {/* Section 17 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">17. Disclaimer of Warranties</h3>
                            <p>
                                The Platform is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, whether express or implied.
                            </p>
                            <p>
                                FoodPort disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and availability.
                            </p>
                            <p>
                                We do not warrant that the Platform will be uninterrupted, secure, accurate, or error-free.
                            </p>
                        </div>

                        {/* Section 18 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">18. Regulatory and Compliance Disclaimer</h3>
                            <p>
                                FoodPort does not provide legal, regulatory, food safety, health, or compliance advice. Users are solely responsible for ensuring compliance with all applicable laws, regulations, permits, licenses, health codes, advertising standards, and industry requirements relevant to their business activities.
                            </p>
                            <p>
                                FoodPort shall not be responsible for any regulatory violations, penalties, or compliance failures incurred by users or partners.
                            </p>
                        </div>

                        {/* Section 19 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">19. Force Majeure</h3>
                            <p>
                                FoodPort shall not be liable for any failure or delay in performance resulting from events beyond its reasonable control, including but not limited to acts of God, natural disasters, power failures, internet outages, labor disputes, government actions, pandemics, or system failures.
                            </p>
                        </div>

                        {/* Section 20 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">20. Data Security and User Responsibility</h3>
                            <p>
                                While FoodPort implements reasonable security measures to protect user data, we do not guarantee absolute security. You acknowledge that electronic transmissions and data storage may be subject to security breaches. You are responsible for maintaining backups of your data and safeguarding your account credentials.
                            </p>
                            <p>
                                FoodPort shall not be liable for data loss, unauthorized access, or security breaches beyond its reasonable control.
                            </p>
                        </div>

                        {/* Section 21 */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold text-primary-900">21. International Use</h3>
                            <p>
                                FoodPort is operated from the United States. If you access the Platform from outside the U.S., you do so at your own initiative and are responsible for compliance with local laws and regulations.
                            </p>
                            <p>
                                FoodPort makes no representations that the Platform is appropriate or available for use in all locations.
                            </p>
                        </div>
                    </div>
                </LayoutWrapper>
            </section>
        </>
    );
}
export default TermsAndConditions;
