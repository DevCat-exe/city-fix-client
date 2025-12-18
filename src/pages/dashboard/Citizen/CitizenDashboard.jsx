import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";

const CitizenDashboard = () => {
  return (
    <DashboardLayout role="citizen">
      <Outlet />
    </DashboardLayout>
  );
};

export default CitizenDashboard;
