import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getAllIssues, updateIssue, deleteIssue } from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import StatusBadge from "../../../components/StatusBadge";
import PriorityBadge from "../../../components/PriorityBadge";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import BlockedWarning from "../../../components/BlockedWarning";

const MyIssues = () => {
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [editingIssue, setEditingIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter issues based on selected filter
  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true;
    if (filter === "in-progress")
      return ["in-progress", "working"].includes(issue.status);
    return issue.status === filter;
  });

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

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-issues"]);
      toast.success("Issue deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete issue");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateIssue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-issues"]);
      setEditingIssue(null);
      toast.success("Issue updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update issue");
    },
  });

  const handleDelete = async (issueId) => {
    if (dbUser?.isBlocked) {
      toast.error("Your account is restricted. You cannot delete issues.");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#0f172a"
        : "#fff",
      color: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#f8fafc"
        : "#0f172a",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(issueId);
    }
  };

  const handleEdit = (issue) => {
    if (dbUser?.isBlocked) {
      toast.error("Your account is restricted. You cannot edit issues.");
      return;
    }
    if (issue.status !== "pending") {
      toast.error("Only pending issues can be edited");
      return;
    }
    setEditingIssue(issue);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      id: editingIssue._id,
      data: {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
      },
    });
  };

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
          My Issues
        </h1>
        <p className="text-base-content/60 mt-1">
          Manage all your reported issues
        </p>
      </div>

      {dbUser?.isBlocked && <BlockedWarning />}

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "pending", "in-progress", "working", "resolved", "closed"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? "bg-primary text-primary-content"
                  : "bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-8 text-center border border-base-200 shadow-sm">
          <p className="text-base-content/40">No issues found</p>
          <Link
            to="/dashboard/citizen/report"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-all"
          >
            Report New Issue
          </Link>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-base-200 bg-base-200/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Title
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Priority
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-base-content mb-1">
                        {issue.title}
                      </div>
                      <div className="text-sm text-base-content/50 truncate max-w-xs">
                        {issue.description}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-base-content/80">
                      {issue.category}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-3">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-info hover:underline inline-flex items-center gap-1"
                        >
                          <FiEye className="text-sm" /> View
                        </Link>
                        {issue.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEdit(issue)}
                              disabled={dbUser?.isBlocked}
                              className={`inline-flex items-center gap-1 ${
                                dbUser?.isBlocked
                                  ? "text-base-content/30 cursor-not-allowed"
                                  : "text-success hover:underline"
                              }`}
                            >
                              <FiEdit className="text-sm" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(issue._id)}
                              disabled={dbUser?.isBlocked}
                              className={`inline-flex items-center gap-1 ${
                                dbUser?.isBlocked
                                  ? "text-base-content/30 cursor-not-allowed"
                                  : "text-error hover:underline"
                              }`}
                            >
                              <FiTrash2 className="text-sm" /> Delete
                            </button>
                          </>
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

      {/* Edit Modal */}
      {editingIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-base-100 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-base-200 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Edit Issue
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingIssue.title}
                  required
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingIssue.description}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editingIssue.category}
                  required
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
                >
                  <option value="Road">Road</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Garbage">Garbage</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Parks">Parks</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingIssue(null)}
                  className="px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Issue"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MyIssues;