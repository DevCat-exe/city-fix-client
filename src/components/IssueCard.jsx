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
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "in-progress":
      case "working":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "resolved":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "closed":
        return "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
      case "rejected":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    return priority === "high"
      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(19, 127, 236, 0.1), 0 10px 10px -5px rgba(19, 127, 236, 0.04)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
    >
      {issue.images && issue.images.length > 0 && (
        <div className="relative w-full aspect-video bg-gray-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url("${issue.images[0]}")` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          {issue.isBoosted && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-lg">
              <MdLocalFireDepartment className="text-sm" />
              <span>Boosted</span>
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border border-primary/20">
            {issue.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
          {issue.title}
        </h3>
        {issue.location?.address && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
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
          <button
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending || dbUser?.isBlocked}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${isOwner || dbUser?.isBlocked
              ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70"
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
            <MdThumbUp className="text-sm" />
            {issue.upvotes || 0}
          </button>
        </div>
        <Link
          to={`/issues/${issue._id}`}
          className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
        >
          <span>View Details</span>
          <MdArrowForward className="text-base" />
        </Link>
      </div>
    </motion.div>
  );
};

export default IssueCard;
