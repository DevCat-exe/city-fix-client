import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  toggleBlockUser,
  updateUser,
} from "../../../api/endpoints";
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
    queryKey: ["all-users-admin"],
    queryFn: () => getAllUsers(),
  });

  const blockMutation = useMutation({
    mutationFn: (userId) => toggleBlockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users-admin"]);
      toast.success("User status updated");
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUser(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users-admin"]);
      toast.success("User role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user role");
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
      background: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#0f172a"
        : "#fff",
      color: document.documentElement.getAttribute("data-theme") === "dark"
        ? "#f8fafc"
        : "#0f172a",
    });

    if (result.isConfirmed) {
      blockMutation.mutate(userId);
    }
  };

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;
    roleMutation.mutate({ userId, role: newRole });
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-error">{error}</div>;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Manage Users
        </h1>
        <p className="text-base-content/60 mt-1">
          View and manage all system users and their roles
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-base-300 bg-base-100 text-base-content rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-12 text-center border border-base-200 shadow-sm">
          <p className="text-base-content/40">No users found</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-200/50 border-b border-base-200">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider">
                    Premium
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider truncate">
                    Joined Date
                  </th>
                  <th className="text-right py-4 px-6 font-bold text-base-content uppercase text-xs tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-base-200">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-base-content">
                            {user.name}
                          </div>
                          <div className="text-xs text-base-content/50">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, user.role, e.target.value)
                        }
                        className="text-sm border-0 bg-transparent focus:ring-0 text-base-content font-medium cursor-pointer hover:text-primary transition-colors"
                      >
                        <option value="citizen" className="bg-base-100">
                          Citizen
                        </option>
                        <option value="staff" className="bg-base-100">
                          Staff
                        </option>
                        <option value="admin" className="bg-base-100">
                          Admin
                        </option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {user.isPremium ? (
                        <span className="px-2 py-1 bg-amber-100 text-black border border-amber-200 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30 text-[10px] font-black uppercase tracking-widest rounded">
                          Premium
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-base-300 text-base-content/60 text-[10px] font-black uppercase tracking-widest rounded">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                          user.isBlocked
                            ? "bg-error/20 text-error"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-base-content/50">
                      {user.createdAt &&
                        format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          handleBlock(user._id, user.isBlocked, user.name)
                        }
                        className={`text-sm font-bold tracking-tight hover:underline ${
                          user.isBlocked
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block User"}
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