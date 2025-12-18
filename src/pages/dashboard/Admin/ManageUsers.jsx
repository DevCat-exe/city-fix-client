import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getAllUsers, toggleBlockUser } from "../../../api/endpoints";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { format } from "date-fns";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const {
    data: usersData,
    isLoading: dataLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["citizen-users"],
    queryFn: () => getAllUsers({ role: "citizen" }),
  });

  const blockMutation = useMutation({
    mutationFn: (userId) => toggleBlockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["citizen-users"]);
      toast.success("User status updated");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const users = usersData?.data?.data?.items || usersData?.data?.items || [];
  const error = queryError?.message;

  const handleBlock = async (userId, isBlocked, userName) => {
    const action = isBlocked ? "unblock" : "block";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${userName}?`,
      text: `This will ${action} the user's access to the platform.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#111827",
    });

    if (result.isConfirmed) {
      blockMutation.mutate(userId);
    }
  };

  if (dataLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Users
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          View and manage citizen users
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#137fec]"
        />
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Premium
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Joined
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {users
                  .filter(
                    (user) =>
                      user.name?.toLowerCase().includes(search.toLowerCase()) ||
                      user.email?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#137fec] flex items-center justify-center text-white font-semibold mr-3">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        {user.isPremium ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                            Premium
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {user.isBlocked ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                        {user.createdAt &&
                          format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            handleBlock(user._id, user.isBlocked, user.name)
                          }
                          className={`${
                            user.isBlocked
                              ? "text-green-600 dark:text-green-400 hover:underline"
                              : "text-red-600 dark:text-red-400 hover:underline"
                          }`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUsers;
