import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  getAllIssues,
  getMyPayments,
  processPaymentSuccess,
} from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import StatsCard from "../../../components/StatsCard";
import { FiFileText, FiClock, FiActivity, FiCheckCircle } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const CitizenOverview = () => {
  const { dbUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle payment success callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      // Confirm payment with server
      processPaymentSuccess({ sessionId })
        .then((response) => {
          const purpose = response.data?.data?.purpose;
          if (purpose === "premium") {
            toast.success(
              "Payment confirmed! Your premium subscription has been activated."
            );
          } else if (purpose === "boost") {
            toast.success("Payment confirmed! Your issue has been boosted.");
          } else {
            // Probably already recorded
            toast.success("Payment confirmed!");
          }
        })
        .catch((error) => {
          console.error("Payment confirmation failed:", error);
          toast.error("Payment confirmation failed. Please contact support.");
        })
        .finally(() => {
          // Clear query parameters
          searchParams.delete("payment");
          searchParams.delete("session_id");
          setSearchParams(searchParams);
        });
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled.");
      searchParams.delete("payment");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!dbUser) return;
      setDataLoading(true);
      setError(null);
      try {
        const issuesResponse = await getAllIssues({ email: dbUser.email });
        const issuesData =
          issuesResponse?.data?.data?.issues ||
          issuesResponse?.data?.issues ||
          [];
        setIssues(issuesData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [dbUser]);

  const { data: paymentsData } = useQuery({
    queryKey: ["my-payments", dbUser?._id],
    queryFn: () => getMyPayments(),
    enabled: !!dbUser,
  });

  /* Fix: Server returns array directly in data, not nested in items */
  const payments = paymentsData?.data?.data || [];

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) =>
      ["in-progress", "working"].includes(i.status)
    ).length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const statusData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "Resolved", value: stats.resolved, color: "#10b981" },
  ].filter((item) => item.value > 0);

  const categoryData = issues.reduce((acc, issue) => {
    const category = issue.category || "Other";
    const existing = acc.find((item) => item.name === category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: category, count: 1 });
    }
    return acc;
  }, []);

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Welcome, {dbUser?.name}!
        </h1>
        <p className="text-base-content/60 mt-1">
          Here's an overview of your reported issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<FiFileText size={24} />}
          title="Total Issues"
          value={stats.total}
          color="blue"
        />
        <StatsCard
          icon={<FiClock size={24} />}
          title="Pending"
          value={stats.pending}
          color="amber"
        />
        <StatsCard
          icon={<FiActivity size={24} />}
          title="In Progress"
          value={stats.inProgress}
          color="purple"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          title="Resolved"
          value={stats.resolved}
          color="green"
        />
      </div>

      {/* Payment Summary */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-base-content mb-2">
          Payment Summary
        </h2>
        <p className="text-3xl font-bold text-primary">৳{totalPayments}</p>
        <p className="text-sm text-base-content/60 mt-1">
          Total spent on boosts and premium
        </p>
        {payments.length > 0 && (
          <div className="mt-4 space-y-2">
            {payments.slice(0, 3).map((payment) => (
              <div
                key={payment._id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-base-content/80 capitalize">
                  {payment.purpose}
                </span>
                <span className="font-medium text-base-content">
                  ৳{payment.amount}
                </span>
              </div>
            ))}
            {payments.length > 3 && (
              <p className="text-xs text-base-content/40 mt-2">
                +{payments.length - 3} more payments
              </p>
            )}
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        {statusData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', color: 'var(--color-base-content)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Issues by Category */}
        {categoryData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Issues by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', color: 'var(--color-base-content)' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#137fec" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Issues */}
      <div className="mt-8 bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
        <h2 className="text-xl font-semibold text-base-content mb-4">
          Recent Issues
        </h2>
        {issues.length === 0 ? (
          <p className="text-base-content/40">
            No issues reported yet
          </p>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300"
              >
                <div>
                  <h3 className="font-semibold text-base-content mb-1">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-base-content/60">
                    {issue.category}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    issue.status === "resolved"
                      ? "bg-success/20 text-success"
                      : issue.status === "pending"
                      ? "bg-warning/20 text-warning"
                      : "bg-info/20 text-info"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CitizenOverview;