import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;
