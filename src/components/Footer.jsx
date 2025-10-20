import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import LayoutWrapper from "./layoutWrapper";
export default function Footer() {
  return (
    <footer className="bg-white">
      <hr className="mt-10" />
      <LayoutWrapper>
        <div
          className="flex flex-col py-10 md:flex-row justify-between items-center"
        >
          <div>
            <h3 className="text-3xl text-center md:text-left font-bold mb-1">
              Join Our <span className="text-primary-50">Newsletter</span>
            </h3>
            <p className="text-primary-800 text-center md:text-left font-medium text-lg mb-6 md:mb-0">
              Be the first to know about our latest updates, exclusive offers,
              and more.
            </p>
          </div>
          <div className="flex  w-[100%] md:w-auto flex-col md:flex-row md:mt-0 gap-y-4 md:gap-y-0 gap-x-3">
            <Input
              placeholder="Enter your email address"
              className="border border-primary-700 md:mb-0 mb-4 h-14 w-full md:w-80"
            />
            <Button className="bg-primary-50 rounded-lg px-8 h-14 cursor-pointer">
              Subscribe
            </Button>
          </div>
        </div>
      </LayoutWrapper>
      <hr className="pb-10 mt-10" />
      <LayoutWrapper>
        <div className="grid grid-cols-1 md:grid-cols-5 items-end ">
          <div>
            <img src="/images/footer-logo.png" alt="" className="" />
            <p className="text-primary-800 leading-relaxed mt-5">
              Food Port, a new food ordering app, faced the challenge of
              entering a crowded market saturated with established players. They
              needed to attract the hungry foodies, restaurant and food truck
              owners.
            </p>
          </div>
          <div></div>
          <div>
            <ul className="space-y-5">
              <li>
                <a href="#" className="text-primary-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-900">
                  Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-900">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-5">
              <li>
                <a href="#" className="text-primary-900">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className=" text-primary-900">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className=" font-semibold mb-4">Let's chat!</h4>
            <p className="mb-4">info@foodport.com</p>
            <div className="flex space-x-3">
              <Facebook className="w-6 h-6  text-primary-50 cursor-pointer" />
              <Twitter className="w-6 h-6  text-primary-50 cursor-pointer" />
              <Instagram className="w-6 h-6  text-primary-50 cursor-pointer" />
            </div>
          </div>
        </div>
      </LayoutWrapper>
      <hr className="pb-10 mt-10" />
      {/* Copyright */}
      <div className="text-center pb-4 text-primary-800">
        <p>© 2024 The Top Notch Designs. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
