import React, { useState, useEffect } from "react";
import {
  getAllIssues,
  getAllUsers,
  getAllPayments,
} from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import StatsCard from "../../../components/StatsCard";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";
import { format } from "date-fns";

const AdminOverview = () => {
  const { user: firebaseUser, dbUser, loading: authLoading } = useAuth();

  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!firebaseUser || !dbUser) return;
      setDataLoading(true);
      setError(null);
      try {
        const [issuesResponse, usersResponse, paymentsResponse] =
          await Promise.all([
            getAllIssues({}),
            getAllUsers({}),
            getAllPayments({}),
          ]);
        const issuesData =
          issuesResponse?.data?.data?.issues ||
          issuesResponse?.data?.issues ||
          [];
        const usersData =
          usersResponse?.data?.data?.items || usersResponse?.data?.items || [];
        const paymentsData =
          paymentsResponse?.data?.data?.items ||
          paymentsResponse?.data?.items ||
          [];
        setIssues(issuesData);
        setUsers(usersData);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [firebaseUser, dbUser]);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!firebaseUser || !dbUser) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">Please log in to view the dashboard.</p>
      </div>
    );
  }

  // Show loading for data fetch
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Error: {error}</p>
      </div>
    );
  }

  const stats = {
    totalIssues: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    rejected: issues.filter((i) => i.status === "rejected").length,
    totalPayments: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    totalUsers: users.length,
  };

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

  const statusData = [
    { name: "Pending", count: stats.pending },
    {
      name: "In Progress",
      count: issues.filter((i) => ["in-progress", "working"].includes(i.status))
        .length,
    },
    { name: "Resolved", count: stats.resolved },
    { name: "Rejected", count: stats.rejected },
  ].filter((item) => item.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
        <p className="text-base-content/60 mt-1">System-wide overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={<FiFileText size={24} />}
          title="Total Issues"
          value={stats.totalIssues}
          color="blue"
        />
        <StatsCard
          icon={<FiClock size={24} />}
          title="Pending Issues"
          value={stats.pending}
          color="amber"
        />
        <StatsCard
          icon={<FiCheckCircle size={24} />}
          title="Resolved Issues"
          value={stats.resolved}
          color="green"
        />
        <StatsCard
          icon={<FiXCircle size={24} />}
          title="Rejected Issues"
          value={stats.rejected}
          color="red"
        />
        <StatsCard
          icon={<FiUsers size={24} />}
          title="Total Users"
          value={stats.totalUsers}
          color="purple"
        />
        <StatsCard
          icon={<FiDollarSign size={24} />}
          title="Total Revenue"
          value={`৳${stats.totalPayments}`}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Issues by Category */}
        {categoryData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">Issues by Category</h2>
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

        {/* Status Distribution */}
        {statusData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-300)', color: 'var(--color-base-content)' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Latest Issues */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-base-content">Latest Issues</h2>
          <Link
            to="/dashboard/admin/all-issues"
            className="text-primary hover:underline font-medium"
          >
            View All →
          </Link>
        </div>
        {issues.length === 0 ? (
          <p className="text-base-content/40">No issues yet</p>
        ) : (
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content mb-1">{issue.title}</h3>
                  <p className="text-sm text-base-content/60">
                    {issue.category} • {issue.location?.address}
                  </p>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Payments */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-base-content">Recent Payments</h2>
          <Link
            to="/dashboard/admin/payments"
            className="text-primary hover:underline font-medium"
          >
            View All →
          </Link>
        </div>
        {payments.length === 0 ? (
          <p className="text-base-content/40">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-base-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-base-content">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-base-content">Purpose</th>
                  <th className="text-left py-3 px-4 font-semibold text-base-content">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-base-content">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment._id} className="hover:bg-base-200 transition-colors">
                    <td className="py-3 px-4 text-base-content/80">{payment.user?.name || payment.user?.email}</td>
                    <td className="py-3 px-4 text-base-content/80 capitalize">{payment.purpose}</td>
                    <td className="py-3 px-4 text-base-content font-medium">৳{payment.amount}</td>
                    <td className="py-3 px-4 text-base-content/50">
                      {payment.createdAt &&
                        format(new Date(payment.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminOverview;