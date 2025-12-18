import { Link } from "react-router-dom";
import { MdPublic, MdPrivacyTip, MdDescription } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 dark:bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-primary to-blue-600">
                <MdPublic className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">CityFix</h3>
                <p className="text-xs text-gray-400">Infrastructure Reports</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Empowering communities to report and resolve public infrastructure
              issues. Together, we build better cities.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-issues"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  All Issues
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 CityFix. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MdPrivacyTip className="text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MdDescription className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
