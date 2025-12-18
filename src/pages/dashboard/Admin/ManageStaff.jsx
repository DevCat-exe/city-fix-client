import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  createStaff,
  updateUser,
  deleteStaff,
} from "../../../api/endpoints";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { motion } from "motion/react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";

const ManageStaff = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      setError(null);
      try {
        const staffResponse = await getAllUsers({ role: "staff" });
        const staffData =
          staffResponse?.data?.data?.items || staffResponse?.data?.items || [];
        setStaff(staffData);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const createMutation = useMutation({
    mutationFn: async (staffData) => {
      // Create Firebase user first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        staffData.email,
        staffData.password
      );

      // Then create in MongoDB
      return createStaff({
        firebaseUid: userCredential.user.uid,
        email: staffData.email,
        name: staffData.name,
        phone: staffData.phone,
        photoURL: staffData.photoURL || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff-users"]);
      setShowCreateModal(false);
      toast.success("Staff member created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create staff member");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff-users"]);
      setEditingStaff(null);
      toast.success("Staff updated successfully");
    },
    onError: () => {
      toast.error("Failed to update staff");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff-users"]);
      toast.success("Staff member deleted");
    },
    onError: () => {
      toast.error("Failed to delete staff member");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    createMutation.mutate({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      photoURL: formData.get("photoURL"),
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      id: editingStaff._id,
      data: {
        name: formData.get("name"),
        phone: formData.get("phone"),
      },
    });
  };

  const handleDelete = async (staffId, staffName) => {
    const result = await Swal.fire({
      title: `Delete ${staffName}?`,
      text: "This will permanently remove the staff member.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#111827",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(staffId);
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Staff
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Create and manage staff members
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FiPlus /> Create Staff
        </button>
      </div>

      {/* Staff Table */}
      {staff.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">
            No staff members yet
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Staff
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Phone
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
                {staff.map((staff) => (
                  <tr
                    key={staff._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {staff.photoURL ? (
                          <img
                            src={staff.photoURL}
                            alt={staff.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#137fec] flex items-center justify-center text-white font-semibold mr-3">
                            {staff.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <div className="font-medium text-gray-900 dark:text-white">
                          {staff.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {staff.email}
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {staff.phone || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      {staff.createdAt &&
                        format(new Date(staff.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingStaff(staff)}
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <FiEdit className="text-sm" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(staff._id, staff.name)}
                          className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                        >
                          <FiTrash2 className="text-sm" /> Delete
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

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create Staff Member
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  name="photoURL"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Staff"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Staff Member
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingStaff.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingStaff.phone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Updating..." : "Update Staff"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageStaff;
