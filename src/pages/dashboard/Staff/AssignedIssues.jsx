import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllIssues, changeStatus } from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const AssignedIssues = () => {
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [updatingIssue, setUpdatingIssue] = useState(null);
  const [progressNote, setProgressNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["staff-assigned-issues", dbUser?._id, filter],
    queryFn: () =>
      getAllIssues({
        assignedStaffId: dbUser._id,
        ...(filter !== "all" && { status: filter }),
      }),
    enabled: !!dbUser,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }) => changeStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff-assigned-issues"]);
      setUpdatingIssue(null);
      setProgressNote("");
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const issues = data?.data?.data?.issues || [];

  // Sort: boosted issues first
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    return 0;
  });

  const handleStatusChange = (issueId) => {
    setUpdatingIssue(issueId);
  };

  const submitStatusChange = (issueId, newStatus) => {
    if (!progressNote.trim()) {
      toast.error("Please add a progress note");
      return;
    }

    updateStatusMutation.mutate({
      id: issueId,
      status: newStatus,
      note: progressNote,
    });
  };

  const statusOptions = [
    "pending",
    "in-progress",
    "working",
    "resolved",
    "closed",
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assigned Issues</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage and update your assigned issues
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "pending", "in-progress", "working", "resolved", "closed"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                ? "bg-[#137fec] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("-", " ")}
            </button>
          )
        )}
      </div>

      {/* Issues Table */}
      {sortedIssues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No assigned issues found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Boost</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {sortedIssues.map((issue) => (
                  <tr
                    key={issue._id}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700 ${issue.isBoosted ? "bg-yellow-50 dark:bg-yellow-900/10" : ""
                      }`}
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
                    <td className="py-4 px-6">
                      {issue.isBoosted && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          Boosted
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-3">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <FiEye className="text-sm" /> View
                        </Link>
                        <button
                          onClick={() => handleStatusChange(issue._id)}
                          className="text-green-600 dark:text-green-400 hover:underline"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updatingIssue && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Issue Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <select
                  id="new-status"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="Add a note about the progress..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setUpdatingIssue(null);
                    setProgressNote("");
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const newStatus =
                      document.getElementById("new-status").value;
                    submitStatusChange(updatingIssue, newStatus);
                  }}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateStatusMutation.isPending
                    ? "Updating..."
                    : "Update Status"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AssignedIssues;
