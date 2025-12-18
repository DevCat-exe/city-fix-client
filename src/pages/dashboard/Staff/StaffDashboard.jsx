import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

const StaffDashboard = () => {
  return (
    <DashboardLayout role="staff">
      <Outlet />
    </DashboardLayout>
  );
};

export default StaffDashboard;
