import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="flex flex-col items-center max-w-3xl px-4 text-center">
          <h1 className="text-[#137fec] text-9xl font-black mb-4">404</h1>
          <div className="space-y-4 mb-8">
            <p className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
              Oops! Page Not Found
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              The page you are looking for doesn't exist or may have been moved.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#137fec] text-white text-base font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
