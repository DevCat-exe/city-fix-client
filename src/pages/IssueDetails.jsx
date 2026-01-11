import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  getIssueById,
  getTimeline,
  upvoteIssue,
  deleteIssue,
} from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import { usePayment } from "../hooks/usePayment";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  MdError,
  MdPhotoLibrary,
  MdDescription,
  MdHistory,
  MdPerson,
  MdThumbUp,
  MdEdit,
  MdDelete,
  MdLocalFireDepartment,
  MdLocationOn,
  MdPlace,
  MdBadge,
  MdClose,
} from "react-icons/md";
import BlockedWarning from "../components/BlockedWarning";
import { DetailSkeleton } from "../components/Skeleton";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();
  const { boostIssue: boostStripeCheckout, isLoading: boostLoading } =
    usePayment();
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: issueData, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssueById(id),
    select: (data) => {
      if (data.success === false) {
        return {};
      }
      // Handle nested structure from Axios
      return data.data?.data?.issue || data.data?.issue || data.data || {};
    },
  });

  const { data: timelineData } = useQuery({
    queryKey: ["timeline", id],
    queryFn: () => getTimeline(id),
    select: (data) => {
      if (data.success === false) {
        return [];
      }
      return data.data?.data || data.data || [];
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue(id),
    onSuccess: () => {
      toast.success("Issue deleted successfully");
      navigate("/all-issues");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete issue");
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: () => upvoteIssue(id),
    onSuccess: () => {
      toast.success("Issue upvoted!");
      queryClient.invalidateQueries({ queryKey: ["issue", id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to upvote");
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#111827",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
      case "in-progress":
      case "working":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
      case "resolved":
        return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
      case "closed":
        return "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  const issue = issueData;
  const timeline = timelineData || [];

  if (!issue || !issue._id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
            <MdError className="text-3xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Issue not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The issue you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/all-issues"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            <span>Back to All Issues</span>
          </Link>
        </div>
      </div>
    );
  }

  /* Logic Fix: Handle different response structures for submitter */
  const submitter = issue.submitterId || issue.submitter;
  const isOwner = dbUser && submitter?._id === dbUser._id;
  /* canEdit/canDelete rely on issue.submitterId which is standard for single issue fetch */
  const canEdit =
    dbUser &&
    issue.submitterId?._id === dbUser._id &&
    issue.status === "pending";
  const canDelete =
    dbUser &&
    issue.submitterId?._id === dbUser._id &&
    issue.status === "pending";

  const handleUpvote = () => {
    if (!dbUser) {
      navigate("/login");
      return;
    }
    if (isOwner) {
      toast.error("You cannot upvote your own issue");
      return;
    }
    upvoteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dbUser?.isBlocked && <BlockedWarning />}
        {/* Image Overlay Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
              onClick={() => setSelectedImage(null)}
            >
              <MdClose className="text-4xl" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 mb-8 text-sm"
        >
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/all-issues"
            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Issues
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            Issue #{issue._id.slice(-6)}
          </span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Images */}
            {issue.images && issue.images.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MdPhotoLibrary className="text-primary text-xl" />
                  Images
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {issue.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-slate-700 cursor-zoom-in"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Issue image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                          Click to expand
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MdDescription className="text-primary text-xl" />
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MdHistory className="text-primary text-xl" />
                Timeline
              </h2>
              <div className="space-y-6">
                {timeline.length > 0 ? (
                  timeline.map((entry, idx) => (
                    <div key={entry._id} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                            idx === 0
                              ? "bg-primary ring-2 ring-primary/20"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        {idx < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 min-h-15"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
                              entry.status
                            )}`}
                          >
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1).replace("-", " ")}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                          {entry.note}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MdPerson className="text-base" />
                          <span>{entry.updatedBy?.name || "System"}</span>
                          <span className="text-gray-400">•</span>
                          <span className="capitalize">
                            {entry.updatedBy?.role || "system"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No timeline entries yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Status & Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status.charAt(0).toUpperCase() +
                    issue.status.slice(1).replace("-", " ")}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                    issue.priority === "high"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                      : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {issue.priority === "high"
                    ? "High Priority"
                    : "Normal Priority"}
                </span>
                {issue.isBoosted && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                    <MdLocalFireDepartment className="text-sm" />
                    Boosted
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUpvote}
                  disabled={upvoteMutation.isPending || dbUser?.isBlocked}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold ${
                    isOwner || dbUser?.isBlocked
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
                  }`}
                  title={
                    dbUser?.isBlocked
                      ? "Your account is blocked"
                      : isOwner
                      ? "You cannot upvote your own issue"
                      : ""
                  }
                >
                  <MdThumbUp className="text-xl" />
                  <span>Upvote ({issue.upvotes || 0})</span>
                </button>

                {canEdit && (
                  <button
                    onClick={() => navigate(`/issues/${id}/edit`)}
                    disabled={dbUser?.isBlocked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-semibold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdEdit className="text-xl" />
                    <span>Edit Issue</span>
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={dbUser?.isBlocked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-semibold shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdDelete className="text-xl" />
                    <span>Delete Issue</span>
                  </button>
                )}

                {!issue.isBoosted && dbUser && (
                  <button
                    onClick={() => boostStripeCheckout(id)}
                    disabled={boostLoading || dbUser?.isBlocked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 transition-all font-semibold shadow-md shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdLocalFireDepartment className="text-xl" />
                    <span>
                      {boostLoading ? "Redirecting..." : "Boost Issue (100tk)"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MdLocationOn className="text-primary text-xl" />
                Location
              </h3>
              <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <MdPlace className="text-gray-400 mt-0.5" />
                <span>{issue.location?.address}</span>
              </p>
            </div>

            {/* Assigned Staff */}
            {(() => {
              const staff = issue.assignedStaff || issue.assignedStaffId;
              if (!staff) return null;
              return (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MdBadge className="text-primary text-xl" />
                    Assigned Staff
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                    {staff.photoURL ? (
                      <img
                        src={staff.photoURL}
                        alt={staff.name}
                        className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-brrom-primary to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {staff.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {staff.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Submitter Info */}
            {issue.submitterId && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MdPerson className="text-primary text-xl" />
                  Reported By
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                  {issue.submitterId.photoURL ? (
                    <img
                      src={issue.submitterId.photoURL}
                      alt={issue.submitterId.name}
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {issue.submitterId.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {issue.submitterId.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {issue.submitterId.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetails;
