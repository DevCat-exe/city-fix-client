import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const Dashboard = () => {
  const navigate = useNavigate();
  const { role, loading } = useRole();

  useEffect(() => {
    if (!loading && role) {
      // Redirect to role-specific dashboard
      if (role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else if (role === "staff") {
        navigate("/dashboard/staff", { replace: true });
      } else {
        navigate("/dashboard/citizen", { replace: true });
      }
    }
  }, [role, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null; // This component will redirect, so no render needed
};

export default Dashboard;
