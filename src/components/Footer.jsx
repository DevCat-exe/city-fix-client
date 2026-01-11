import { Link } from "react-router-dom";
import { useState } from "react";
import {
  MdLocationOn,
  MdSend,
  MdPublic,
  MdEmail,
  MdPhone,
} from "react-icons/md";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-gray-900 dark:bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-primary to-blue-600 shadow-lg">
                <MdPublic className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">CityFix</h3>
                <p className="text-sm text-gray-400">Infrastructure Reports</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-md">
              Empowering communities to report and resolve public infrastructure
              issues. Together, we build better, safer cities for everyone.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MdEmail className="text-lg" />
                <span>support@cityfix.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MdPhone className="text-lg" />
                <span>1-800-CITYFIX</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MdLocationOn className="text-lg" />
                <span>123 Main St, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-issues"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  All Issues
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Blog & News
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/report"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/api"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  API Access
                </Link>
              </li>
              <li>
                <Link
                  to="/enterprise"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Enterprise
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6">Account & Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Connect with us:</span>
              <div className="flex gap-3">
                <a
                  href="mailto:support@cityfix.com"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                  aria-label="Email"
                >
                  <MdEmail className="text-lg" />
                </a>
                <a
                  href="tel:1-800-cityfix"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                  aria-label="Phone"
                >
                  <MdPhone className="text-lg" />
                </a>
              </div>
            </div>

            {/* Copyright and Legal Links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <p>© 2024 CityFix. All Rights Reserved.</p>
              <div className="flex items-center gap-4">
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </a>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a
                  href="/sitemap"
                  className="hover:text-white transition-colors"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center z-40"
          aria-label="Back to top"
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
