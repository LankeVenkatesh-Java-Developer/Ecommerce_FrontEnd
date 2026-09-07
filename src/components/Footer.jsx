import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">ShopHub</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for all your needs. Quality products at great prices with exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-gray-800 hover:bg-primary-600 transition-all duration-300 hover:scale-110">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-400 text-sm">Subscribe for exclusive deals and updates</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
