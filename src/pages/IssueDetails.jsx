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
      background: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#0f172a"
        : "#fff",
      color: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#f8fafc"
        : "#0f172a",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "in-progress":
      case "working":
        return "bg-info/10 text-info border-info/20";
      case "resolved":
        return "bg-success/10 text-success border-success/20";
      case "closed":
        return "bg-base-200 text-base-content/60 border-base-300";
      case "rejected":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-base-200 text-base-content/60 border-base-300";
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 mb-4">
            <MdError className="text-3xl text-base-content/20" />
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Issue not found
          </h2>
          <p className="text-base-content/60 mb-6">
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
    <div className="min-h-screen bg-gradient-page">
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
            className="text-base-content/60 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <span className="text-base-content/20">/</span>
          <Link
            to="/all-issues"
            className="text-base-content/60 hover:text-primary transition-colors"
          >
            Issues
          </Link>
          <span className="text-base-content/20">/</span>
          <span className="text-base-content font-medium">
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
              <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
                <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                  <MdPhotoLibrary className="text-primary text-xl" />
                  Images
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {issue.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden aspect-video bg-base-300 cursor-zoom-in"
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
            <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
              <h2 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
                <MdDescription className="text-primary text-xl" />
                Description
              </h2>
              <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
              <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
                <MdHistory className="text-primary text-xl" />
                Timeline
              </h2>
              <div className="space-y-6">
                {timeline.length > 0 ? (
                  timeline.map((entry, idx) => (
                    <div key={entry._id} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 border-base-100 ${
                            idx === 0
                              ? "bg-primary ring-2 ring-primary/20"
                              : "bg-base-300"
                          }`}
                        ></div>
                        {idx < timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-base-200 mt-2 min-h-15"></div>
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
                          <span className="text-sm text-base-content/50">
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
                        <p className="text-base-content font-medium mb-2">
                          {entry.note}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-base-content/50">
                          <MdPerson className="text-base" />
                          <span>{entry.updatedBy?.name || "System"}</span>
                          <span className="text-base-content/20">•</span>
                          <span className="capitalize">
                            {entry.updatedBy?.role || "system"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/40 text-center py-8">
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
            <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm sticky top-24">
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
                      ? "bg-error/10 text-error border-error/20"
                      : "bg-base-200 text-base-content/60 border-base-300"
                  }`}
                >
                  {issue.priority === "high"
                    ? "High Priority"
                    : "Normal Priority"}
                </span>
                {issue.isBoosted && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
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
                      ? "bg-base-200 text-base-content/40 cursor-not-allowed"
                      : "bg-base-200 text-base-content/70 hover:bg-primary/10 hover:text-primary"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-content hover:bg-primary/90 transition-all font-semibold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdEdit className="text-xl" />
                    <span>Edit Issue</span>
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={dbUser?.isBlocked}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-error text-error-content hover:bg-error/90 transition-all font-semibold shadow-md shadow-error/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
              <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                <MdLocationOn className="text-primary text-xl" />
                Location
              </h3>
              <p className="text-base-content/80 flex items-start gap-2">
                <MdPlace className="text-base-content/40 mt-0.5" />
                <span>{issue.location?.address}</span>
              </p>
            </div>

            {/* Assigned Staff */}
            {(() => {
              const staff = issue.assignedStaff || issue.assignedStaffId;
              if (!staff) return null;
              return (
                <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
                  <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                    <MdBadge className="text-primary text-xl" />
                    Assigned Staff
                  </h3>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50">
                    {staff.photoURL ? (
                      <img
                        src={staff.photoURL}
                        alt={staff.name}
                        className="w-12 h-12 rounded-full border-2 border-base-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {staff.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-base-content font-semibold">
                        {staff.name}
                      </p>
                      <p className="text-sm text-base-content/50">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Submitter Info */}
            {issue.submitterId && (
              <div className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm">
                <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                  <MdPerson className="text-primary text-xl" />
                  Reported By
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50">
                  {issue.submitterId.photoURL ? (
                    <img
                      src={issue.submitterId.photoURL}
                      alt={issue.submitterId.name}
                      className="w-12 h-12 rounded-full border-2 border-base-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {issue.submitterId.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-base-content font-semibold">
                      {issue.submitterId.name}
                    </p>
                    <p className="text-sm text-base-content/50">
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