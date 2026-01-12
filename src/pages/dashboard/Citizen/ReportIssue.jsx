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
          <h1 className="text-3xl font-bold text-base-content">
            Issue Limit Reached
          </h1>
          <p className="text-base-content/60 mt-1">
            You've reported {myIssuesCount}/3 issues on the Free Plan
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-base-100 rounded-lg shadow-md p-8 text-center border border-base-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-base-content mb-4">
                Upgrade to Premium
              </h2>
              <p className="text-base-content/60 mb-6">
                Get unlimited issue reporting and priority support for just
                ৳1000 (one-time payment)
              </p>

              <div className="grid grid-cols-1 gap-3 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-success"
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
                  <span className="text-sm text-base-content/80">
                    Unlimited issues
                  </span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-success"
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
                  <span className="text-sm text-base-content/80">
                    Priority support
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-primary mb-2">৳1000</p>
                <p className="text-sm text-base-content/40">
                  One-time payment • Lifetime access
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/citizen/profile"
              className="w-full px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 font-medium transition-colors inline-block text-center shadow-lg shadow-primary/20"
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
        <h1 className="text-3xl font-bold text-base-content">
          Report New Issue
        </h1>
        <p className="text-base-content/60 mt-1">
          Help improve your community by reporting infrastructure issues
        </p>
        {!dbUser?.isPremium && (
          <p className="text-sm text-warning mt-2 font-medium">
            You have reported {myIssuesCount}/3 issues (Free Plan)
          </p>
        )}
      </div>

      {dbUser?.isBlocked && <BlockedWarning />}

      <div
        className={`bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm ${
          dbUser?.isBlocked ? "opacity-60 grayscale-[0.5]" : ""
        }`}
      >
        <form id="report-form" onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={dbUser?.isBlocked} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Brief description of the issue"
                className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content placeholder:text-base-content/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Description <span className="text-error">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={5}
                placeholder="Detailed description of the issue"
                className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content placeholder:text-base-content/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Category <span className="text-error">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
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
              <label className="block text-sm font-medium text-base-content/80 mb-1">
                Location (Address) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Street address or landmark"
                className="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary bg-base-100 text-base-content placeholder:text-base-content/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Images (Max 5)
              </label>
              <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center bg-base-200/50">
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
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors"
                >
                  <FiUpload className="mr-2" />
                  Choose Images
                </label>
                <p className="text-sm text-base-content/40 mt-2">
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
                        className="w-full h-24 object-cover rounded-lg border border-base-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-error text-error-content rounded-full p-1 hover:bg-error/90"
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
              className="flex-1 px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dbUser?.isBlocked
                ? "Account Restricted"
                : uploading || createIssueMutation.isPending
                ? "Submitting..."
                : "Submit Issue"}
            </button>
            <Link
              to="/dashboard/citizen/my-issues"
              className="px-6 py-3 bg-base-300 text-base-content rounded-lg hover:bg-base-200 transition-colors font-medium"
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