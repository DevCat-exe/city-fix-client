import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createIssue,
  uploadMultipleImages,
  getAllIssues,
} from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import BlockedWarning from "../../../components/BlockedWarning";

const ReportIssue = () => {
  const { dbUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: myIssuesData } = useQuery({
    queryKey: ["my-issues", dbUser?._id],
    queryFn: () => getAllIssues({ email: dbUser.email }),
    enabled: !!dbUser,
  });

  const myIssuesCount = myIssuesData?.data?.data?.issues?.length || 0;
  const canReport = dbUser?.isPremium || myIssuesCount < 3;

  const createIssueMutation = useMutation({
    mutationFn: (data) => createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-issues"]);
      toast.success("Issue reported successfully!");
      // Reset form
      document.getElementById("report-form").reset();
      setSelectedImages([]);
      setImagePreviews([]);
    },
    onError: (error) => {
      // Show more helpful error for forbidden (403) and not found (404)
      if (error?.response?.status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else if (error?.response?.status === 404) {
        toast.error("Resource not found.");
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to report issue"
        );
      }
    },
  });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    setSelectedImages([...selectedImages, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canReport) {
      toast.error(
        "You have reached the limit of 3 issues. Please subscribe to premium."
      );
      return;
    }

    const formData = new FormData(e.target);

    try {
      setUploading(true);
      let imageUrls = [];

      if (selectedImages.length > 0) {
        const uploadResponse = await uploadMultipleImages(selectedImages);

        // Handle both structure versions for robustness
        imageUrls =
          uploadResponse.data.urls ||
          uploadResponse.data.data?.map((img) =>
            typeof img === "string" ? img : img.url
          ) ||
          [];
      }

      const issueData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        location: {
          address: formData.get("address"),
        },
        images: imageUrls,
      };

      createIssueMutation.mutate(issueData);
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  if (!canReport && !dbUser?.isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Issue Limit Reached
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            You've reported {myIssuesCount}/3 issues on the Free Plan
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-slate-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Upgrade to Premium
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get unlimited issue reporting and priority support for just
                ৳1000 (one-time payment)
              </p>

              <div className="grid grid-cols-1 gap-3 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Unlimited issues
                  </span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Priority support
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-[#137fec] mb-2">৳1000</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  One-time payment • Lifetime access
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/citizen/profile"
              className="w-full px-6 py-3 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 font-medium transition-colors inline-block text-center"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Report New Issue
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Help improve your community by reporting infrastructure issues
        </p>
        {!dbUser?.isPremium && (
          <p className="text-sm text-amber-600 mt-2">
            You have reported {myIssuesCount}/3 issues (Free Plan)
          </p>
        )}
      </div>

      {dbUser?.isBlocked && <BlockedWarning />}

      <div
        className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm ${
          dbUser?.isBlocked ? "opacity-60 grayscale-[0.5]" : ""
        }`}
      >
        <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={dbUser?.isBlocked} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Brief description of the issue"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Detailed description of the issue"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a category</option>
                <option value="Road">Road</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Garbage">Garbage</option>
                <option value="Drainage">Drainage</option>
                <option value="Parks">Parks</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location (Address) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Street address or landmark"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <FiUpload className="mr-2" />
                  Choose Images
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </fieldset>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={
                createIssueMutation.isPending || uploading || dbUser?.isBlocked
              }
              className="flex-1 px-6 py-3 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dbUser?.isBlocked
                ? "Account Restricted"
                : uploading || createIssueMutation.isPending
                ? "Submitting..."
                : "Submit Issue"}
            </button>
            <Link
              to="/dashboard/citizen/my-issues"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ReportIssue;
