import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  MdHome,
  MdArticle,
  MdAddCircle,
  MdPerson,
  MdPeople,
  MdSettings,
  MdAttachMoney,
  MdLogout,
  MdDashboard,
} from "react-icons/md";
import { motion } from "motion/react";

const Sidebar = () => {
  const { dbUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!dbUser) return null;

  const role = dbUser.role;

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

  const navItems = menuItems[role] || [];

  const isActive = (path) => {
    if (path === `/dashboard/${role}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-base-100 border-r border-base-200 hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4 space-y-1 overflow-y-auto flex-1">
        <p className="px-4 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              <Icon className="text-xl" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-base-200">
        <button
          onClick={() => {
            signOut();
            navigate("/");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
