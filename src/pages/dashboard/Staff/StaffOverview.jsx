import React, { useEffect, useState } from "react";
import { getAllIssues } from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import StatsCard from "../../../components/StatsCard";
import {
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion as Motion } from "motion/react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";

const StaffOverview = () => {
  const { dbUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dbUser) return;
      setDataLoading(true);
      setError(null);
      try {
        const issuesResponse = await getAllIssues({
          assignedStaffId: dbUser._id,
        });
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

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) =>
      ["in-progress", "working"].includes(i.status)
    ).length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    boosted: issues.filter((i) => i.isBoosted).length,
  };

  const priorityData = [
    {
      name: "High Priority",
      value: issues.filter((i) => i.priority === "high").length,
      color: "#ef4444",
    },
    {
      name: "Normal",
      value: issues.filter((i) => i.priority !== "high").length,
      color: "#6b7280",
    },
  ].filter((item) => item.value > 0);

  const statusData = issues.reduce((acc, issue) => {
    const existing = acc.find((item) => item.name === issue.status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: issue.status, count: 1 });
    }
    return acc;
  }, []);

  const todayIssues = issues.filter((issue) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const issueDate = new Date(issue.createdAt).setHours(0, 0, 0, 0);
    return issueDate === today;
  });

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Welcome, {dbUser?.name}!
        </h1>
        <p className="text-base-content/60 mt-1">
          Here's an overview of your assigned issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<FiFileText size={24} />}
          title="Total Assigned"
          value={stats.total}
          color="blue"
        />
        <StatsCard
          icon={<FiClock size={24} />}
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
        <StatsCard
          icon={<FiTrendingUp size={24} />}
          title="Boosted Issues"
          value={stats.boosted}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Priority Distribution */}
        {priorityData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">
              Priority Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
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

        {/* Status Breakdown */}
        {statusData.length > 0 && (
          <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
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

      {/* Today's Tasks */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm mb-6">
        <h2 className="text-xl font-semibold text-base-content mb-4">Today's Assigned Issues</h2>
        {todayIssues.length === 0 ? (
          <p className="text-base-content/40">No issues assigned today</p>
        ) : (
          <div className="space-y-3">
            {todayIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-xl border border-base-300"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-base-content mb-1">{issue.title}</h3>
                  <p className="text-sm text-base-content/60">{issue.category}</p>
                  {issue.isBoosted && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 rounded-full">
                      Boosted
                    </span>
                  )}
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boosted Issues (High Priority) */}
      {stats.boosted > 0 && (
        <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-base-content">Boosted Issues (Priority)</h2>
            <Link
              to="/dashboard/staff/assigned"
              className="text-primary hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {issues
              .filter((issue) => issue.isBoosted)
              .slice(0, 5)
              .map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold text-base-content mb-1">{issue.title}</h3>
                    <p className="text-sm text-base-content/60">
                      {issue.location?.address}
                    </p>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
              ))}
          </div>
        </div>
      )}
    </Motion.div>
  );
};

export default StaffOverview;