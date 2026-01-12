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
        <h1 className="text-3xl font-bold text-base-content">
          Profile
        </h1>
        <p className="text-base-content/60 mt-1">
          Manage your staff account information
        </p>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-sm p-6 border border-base-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-base-content">
            Account Information
          </h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={dbUser?.name}
                required
                className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-base-300 rounded-lg bg-base-100 text-base-content file:bg-base-200 file:text-base-content file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium"
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 animate-pulse">
                  Uploading...
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors"
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
                  className="w-20 h-20 rounded-full object-cover border-2 border-base-300"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold shadow-sm">
                  {dbUser?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-base-content">
                  {dbUser?.name}
                </h3>
                <p className="text-base-content/60">
                  {dbUser?.email}
                </p>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-info/10 text-info border border-info/20 rounded-full">
                  Staff Member
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/50">Role</p>
                <p className="font-medium text-base-content capitalize">
                  {dbUser?.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/50">
                  Member Since
                </p>
                <p className="font-medium text-base-content">
                  {dbUser?.createdAt &&
                    format(new Date(dbUser.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              {dbUser?.phone && (
                <div>
                  <p className="text-sm text-base-content/50">
                    Phone
                  </p>
                  <p className="font-medium text-base-content">
                    {dbUser.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-info/10 rounded-2xl p-6 border border-info/20">
        <h3 className="text-lg font-semibold text-info mb-2">
          Staff Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-base-content/70">
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