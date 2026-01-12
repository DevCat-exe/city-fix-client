import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MdError, MdArrowBack } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200/50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <MdError className="text-9xl text-error/20 mx-auto mb-8" />
        <h1 className="text-9xl font-black text-base-content/10 mb-4">404</h1>
        <p className="text-base-content text-3xl md:text-4xl font-bold mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-base-content/60 text-lg mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-primary/90 transition-all hover:-translate-y-1"
        >
          <MdArrowBack className="text-xl" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;