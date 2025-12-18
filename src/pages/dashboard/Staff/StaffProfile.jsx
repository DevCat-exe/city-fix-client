import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, uploadImage } from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { motion } from "motion/react";

const StaffProfile = () => {
  const { dbUser, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data) => updateUser(dbUser._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      refreshUser();
      setEditing(false);
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadImage(file);
      const imageUrl = response.data.url;

      updateMutation.mutate({ photoURL: imageUrl });
    } catch {
      ``;
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      name: formData.get("name"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your staff account information
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Information
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-[#137fec] hover:bg-blue-50 rounded-lg font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={dbUser?.name}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white file:bg-gray-50 dark:file:bg-slate-600 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-gray-700 dark:file:text-gray-300"
              />
              {uploading && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Uploading...
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              {dbUser?.photoURL ? (
                <img
                  src={dbUser.photoURL}
                  alt={dbUser.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#137fec] flex items-center justify-center text-white text-2xl font-bold">
                  {dbUser?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dbUser?.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {dbUser?.email}
                </p>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                  Staff Member
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {dbUser?.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member Since
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {dbUser?.createdAt &&
                    format(new Date(dbUser.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              {dbUser?.phone && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {dbUser.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Staff Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• Respond to assigned issues promptly</li>
          <li>• Keep status updates regular and detailed</li>
          <li>• Prioritize boosted issues for faster resolution</li>
          <li>• Maintain professional communication in timeline notes</li>
          <li>• Contact admin if you need assistance</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default StaffProfile;
