import React from "react";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      {/* Main Content */}
      <main className="pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
