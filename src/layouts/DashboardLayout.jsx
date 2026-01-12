import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-page flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar - Visible on Desktop */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-transparent">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;