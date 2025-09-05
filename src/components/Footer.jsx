import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-red-400 to-pink-400 py-12">
            <div className="container mx-auto px-4">
                {/* Newsletter section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-white/20">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Join Our <span className="text-red-800">Newsletter</span>
                        </h3>
                        <p className="text-white/90">Be the first to know about our latest updates, exclusive offers, and more.</p>
                    </div>
                    <div className="flex mt-4 md:mt-0">
                        <Input
                            placeholder="Enter your email address"
                            className="bg-white/90 border-0 rounded-l-lg rounded-r-none w-80"
                        />
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-l-none rounded-r-lg px-8">
                            Subscribe
                        </Button>
                    </div>
                </div>

                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Logo and description */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="text-red-800 text-2xl font-bold">FOOD</div>
                            <div className="text-white text-2xl font-bold">PORT</div>
                            <div className="w-8 h-6 bg-red-800 rounded-sm flex items-center justify-center">
                                <div className="w-4 h-3 bg-white rounded-sm"></div>
                            </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Food Port, a new food ordering app, faced the challenge of entering a crowded market saturated with
                            established players. They needed to attract the hungry foodies, restaurant and food truck owners.
                        </p>
                    </div>

                    {/* Links columns */}
                    <div>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    Jobs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    Terms and Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white hover:text-red-200 transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Let's chat!</h4>
                        <p className="text-white/80 mb-4">info@foodport.com</p>
                        <div className="flex space-x-3">
                            <Facebook className="w-6 h-6 text-white hover:text-red-200 cursor-pointer transition-colors" />
                            <Twitter className="w-6 h-6 text-white hover:text-red-200 cursor-pointer transition-colors" />
                            <Instagram className="w-6 h-6 text-white hover:text-red-200 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-white/20">
                    <p className="text-white/70 text-sm">© 2024 The Top Notch Designs. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}
