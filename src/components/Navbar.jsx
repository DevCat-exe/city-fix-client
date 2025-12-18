import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "motion/react";
import { useState } from "react";
import {
  MdBusiness,
  MdExpandMore,
  MdDashboard,
  MdLogout,
  MdLogin,
  MdMenu,
  MdClose,
  MdHome,
  MdArticle,
  MdAddCircle,
  MdPerson,
  MdPeople,
  MdSettings,
  MdAttachMoney,
} from "react-icons/md";

const Navbar = () => {
  const { dbUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Check if we're in dashboardom
  const isDashboard = location.pathname.startsWith("/dashboard");
  const dashboardRole = isDashboard ? location.pathname.split("/")[2] : null;

  // Dashboard navigation items
  const getDashboardNav = () => {
    const menuItems = {
      citizen: [
        { path: "/dashboard/citizen", icon: MdHome, label: "Overview" },
        {
          path: "/dashboard/citizen/my-issues",
          icon: MdArticle,
          label: "My Issues",
        },
        {
          path: "/dashboard/citizen/report",
          icon: MdAddCircle,
          label: "Report Issue",
        },
        {
          path: "/dashboard/citizen/profile",
          icon: MdPerson,
          label: "Profile",
        },
      ],
      staff: [
        { path: "/dashboard/staff", icon: MdHome, label: "Overview" },
        {
          path: "/dashboard/staff/assigned",
          icon: MdArticle,
          label: "Assigned Issues",
        },
        { path: "/dashboard/staff/profile", icon: MdPerson, label: "Profile" },
      ],
      admin: [
        { path: "/dashboard/admin", icon: MdHome, label: "Overview" },
        {
          path: "/dashboard/admin/all-issues",
          icon: MdArticle,
          label: "All Issues",
        },
        {
          path: "/dashboard/admin/users",
          icon: MdPeople,
          label: "Manage Users",
        },
        {
          path: "/dashboard/admin/staff",
          icon: MdSettings,
          label: "Manage Staff",
        },
        {
          path: "/dashboard/admin/payments",
          icon: MdAttachMoney,
          label: "Payments",
        },
      ],
    };

    return menuItems[dashboardRole] || [];
  };

  const isActive = (path) => {
    if (path === `/dashboard/${dashboardRole}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-900 dark:text-white group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-primary to-blue-600 shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all"
            >
              <MdBusiness className="text-white text-2xl" />
            </motion.div>
            <div className="hidden sm:block">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
              >
                CityFix
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5"
              >
                Infrastructure Reports
              </motion.p>
            </div>
          </Link>
          <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
            {isDashboard ? (
              // Dashboard navigation
              getDashboardNav().map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {item.label}
                  </Link>
                );
              })
            ) : (
              // Regular navigation
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/all-issues"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/all-issues"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  All Issues
                </Link>
                <Link
                  to="/about"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/about"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/contact"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Contact Us
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {dbUser ? (
              <div className="hidden md:block group relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div
                    className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md"
                    style={
                      dbUser.photoURL
                        ? {
                            backgroundImage: `url("${dbUser.photoURL}")`,
                            backgroundSize: "cover",
                          }
                        : {}
                    }
                  >
                    {!dbUser.photoURL && dbUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">
                    {dbUser.name}
                  </span>
                  <MdExpandMore className="text-gray-400 text-lg" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {dbUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {dbUser.email}
                    </p>
                    {dbUser.isPremium && (
                      <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Premium
                      </span>
                    )}
                  </div>
                  {dbUser.role === "citizen" && (
                    <Link
                      to="/dashboard/citizen"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  {dbUser.role === "staff" && (
                    <Link
                      to="/dashboard/staff"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  {dbUser.role === "admin" && (
                    <Link
                      to="/dashboard/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <MdLogout className="text-base" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-linear-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40"
              >
                <MdLogin className="text-base" />
                Login
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <MdClose className="text-xl" />
              ) : (
                <MdMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="px-4 py-6 space-y-4">
            {isDashboard ? (
              // Dashboard navigation for mobile
              getDashboardNav().map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="text-lg" />
                    {item.label}
                  </Link>
                );
              })
            ) : (
              // Regular navigation for mobile
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/all-issues"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/all-issues"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  All Issues
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/about"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/contact"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Contact Us
                </Link>
              </>
            )}

            {/* User actions for mobile */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              {dbUser ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {dbUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {dbUser.email}
                    </p>
                  </div>
                  {dbUser.role === "citizen" && (
                    <Link
                      to="/dashboard/citizen"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  {dbUser.role === "staff" && (
                    <Link
                      to="/dashboard/staff"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  {dbUser.role === "admin" && (
                    <Link
                      to="/dashboard/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MdDashboard className="text-base" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      navigate("/");
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <MdLogout className="text-base" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-linear-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md shadow-primary/30"
                >
                  <MdLogin className="text-base" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
