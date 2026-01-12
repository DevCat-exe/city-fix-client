import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { getAllIssues } from "../api/endpoints";

import IssueCard from "../components/IssueCard";
import { SkeletonLoader } from "../components/Skeleton";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdInbox,
} from "react-icons/md";

const AllIssues = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["issues", page, search, category, status, priority, sort],
    queryFn: () =>
      getAllIssues({
        page,
        limit: 12,
        q: search || undefined,
        category: category || undefined,
        status: status || undefined,
        priority: priority || undefined,
        sort: sort,
      }),
    select: (data) =>
      data.data?.data || {
        issues: [],
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
  });

  return (
    <div className="min-h-screen bg-gradient-page">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-base-content mb-3 tracking-tight">
            All Reported Issues
          </h1>
          <p className="text-lg text-base-content/60">
            Browse, search, and filter all public infrastructure issues in your
            community.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8 p-6 bg-base-100 rounded-2xl border border-base-200 shadow-sm"
        >
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl" />
              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="">All Categories</option>
                <option value="Roads">Roads</option>
                <option value="Utilities">Utilities</option>
                <option value="Parks">Parks</option>
                <option value="Garbage">Garbage</option>
                <option value="Sidewalks">Sidewalks</option>
                <option value="Public Spaces">Public Spaces</option>
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="working">Working</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-semibold text-primary"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Issues Grid */}
        {isLoading ? (
          <SkeletonLoader count={12} />
        ) : data.issues && data.issues.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {data.issues.map((issue, index) => (
                <motion.div
                  key={issue._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <IssueCard issue={issue} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  <MdChevronLeft className="text-lg" />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(5, data.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (data.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            page === pageNum
                              ? "bg-primary text-white shadow-lg shadow-primary/30"
                              : "bg-base-100 text-base-content border border-base-300 hover:bg-base-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages, p + 1))
                  }
                  disabled={page === data.totalPages}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Next
                  <MdChevronRight className="text-lg" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-base-200 mb-6">
              <MdInbox className="text-4xl text-base-content/40" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">
              No issues found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setStatus("");
                setPriority("");
                setSort("newest");
                setPage(1);
              }}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllIssues;