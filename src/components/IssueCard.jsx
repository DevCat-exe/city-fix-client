import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upvoteIssue } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import {
  MdLocalFireDepartment,
  MdLocationOn,
  MdThumbUp,
  MdArrowForward,
} from "react-icons/md";

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: () => upvoteIssue(issue._id),
    onSuccess: () => {
      toast.success("Issue upvoted!");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Failed to upvote");
      }
    },
  });

  const submitter = issue.submitter || issue.submitterId;
  const isOwner = dbUser && submitter?._id === dbUser._id;

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const getPriorityColor = (priority) => {
    return priority === "high"
      ? "bg-error/10 text-error border-error/20"
      : "bg-base-200 text-base-content/60 border-base-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
    >
      {issue.images && issue.images.length > 0 && (
        <div className="relative w-full aspect-video bg-base-300 overflow-hidden">
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url("${issue.images[0]}")` }}
          ></div>
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      )}
      <div className="p-6 flex flex-col grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {issue.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-base-content mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {issue.title}
        </h3>
        {issue.location?.address && (
          <p className="text-sm text-base-content/60 mb-4 flex items-center gap-1.5">
            <MdLocationOn className="text-base" />
            <span className="line-clamp-1">{issue.location.address}</span>
          </p>
        )}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(
              issue.status
            )}`}
          >
            {issue.status.charAt(0).toUpperCase() +
              issue.status.slice(1).replace("-", " ")}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(
              issue.priority
            )}`}
          >
            {issue.priority === "high" ? "High Priority" : "Normal"}
          </span>
          {issue.isBoosted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
              <MdLocalFireDepartment className="text-xs" />
              Boosted
            </span>
          )}
          <button
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending || dbUser?.isBlocked}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isOwner || dbUser?.isBlocked
              ? "bg-base-200 text-base-content/40 cursor-not-allowed opacity-70"
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
            <MdThumbUp className="text-sm" />
            {issue.upvotes || 0}
          </button>
        </div>
        <Link
          to={`/issues/${issue._id}`}
          className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-linear-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
        >
          <span>View Details</span>
          <MdArrowForward className="text-base" />
        </Link>
      </div>
    </motion.div>
  );
};

export default IssueCard;