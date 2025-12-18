import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllIssues,
  getAllUsers,
  assignStaff,
  changeStatus,
} from "../../../api/endpoints";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "motion/react";

const ManageAllIssues = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [assigningIssue, setAssigningIssue] = useState(null);

  const { data: issuesData, isLoading } = useQuery({
    queryKey: ["all-issues-manage", filter, search],
    queryFn: () =>
      getAllIssues({
        ...(filter !== "all" && { status: filter }),
        ...(search && { q: search }),
      }),
  });

  const { data: usersData } = useQuery({
    queryKey: ["staff-users"],
    queryFn: () => getAllUsers({ role: "staff" }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ issueId, staffId }) => assignStaff(issueId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues-manage"]);
      setAssigningIssue(null);
      toast.success("Staff assigned successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign staff");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (issueId) =>
      changeStatus(issueId, "rejected", "Issue rejected by admin"),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues-manage"]);
      toast.success("Issue rejected");
    },
    onError: () => {
      toast.error("Failed to reject issue");
    },
  });

  const issues =
    issuesData?.data?.data?.issues || issuesData?.data?.issues || [];
  const staffMembers = usersData?.data?.data?.items || [];

  const handleAssign = (staffId) => {
    if (!staffId) {
      toast.error("Please select a staff member");
      return;
    }
    assignMutation.mutate({ issueId: assigningIssue, staffId });
  };

  const handleReject = async (issueId) => {
    const result = await Swal.fire({
      title: "Reject this issue?",
      text: "The issue will be marked as rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject it",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#111827",
    });

    if (result.isConfirmed) {
      rejectMutation.mutate(issueId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage All Issues
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Assign staff and manage all reported issues
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#137fec]"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            "all",
            "pending",
            "in-progress",
            "working",
            "resolved",
            "rejected",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-[#137fec] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Table */}
      {issues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No issues found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Priority
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Assigned
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {issue.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {issue.description}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {issue.category}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {issue.assignedStaff || issue.assignedStaffId ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {issue.assignedStaff?.name ||
                            issue.assignedStaffId?.name ||
                            issue.assignedStaff?.email ||
                            issue.assignedStaffId?.email}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-3">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <FiEye className="text-sm" /> View
                        </Link>
                        {!(issue.assignedStaff || issue.assignedStaffId) && (
                          <button
                            onClick={() => setAssigningIssue(issue._id)}
                            className="text-green-600 dark:text-green-400 hover:underline"
                          >
                            Assign
                          </button>
                        )}
                        {issue.status === "pending" && (
                          <button
                            onClick={() => handleReject(issue._id)}
                            className="text-red-600 dark:text-red-400 hover:underline"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assigningIssue && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Assign Staff Member
            </h2>
            <div className="space-y-4">
              <select
                id="staff-select"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a staff member</option>
                {staffMembers.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name || staff.email}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setAssigningIssue(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const staffId =
                      document.getElementById("staff-select").value;
                    handleAssign(staffId);
                  }}
                  disabled={assignMutation.isPending}
                  className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {assignMutation.isPending ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageAllIssues;
