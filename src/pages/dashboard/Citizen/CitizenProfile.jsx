import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateUser,
  uploadImage,
  getMyPayments,
  getInvoice,
} from "../../../api/endpoints";
import { useAuth } from "../../../hooks/useAuth";
import { usePayment } from "../../../hooks/usePayment";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { FiAward, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import BlockedWarning from "../../../components/BlockedWarning";

const CitizenProfile = () => {
  const { dbUser, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const { subscribePremium, isLoading: paymentLoading } = usePayment();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: paymentsData } = useQuery({
    queryKey: ["my-payments", dbUser?._id],
    queryFn: () => getMyPayments(),
    enabled: !!dbUser,
  });

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

  /* Fix: Server returns array directly in data, not nested in items */
  const payments = paymentsData?.data?.data || [];

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

  const handleSubscribe = () => {
    subscribePremium();
  };

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const response = await getInvoice(paymentId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch {
      toast.error("Failed to download invoice");
    }
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
          Manage your account information
        </p>
      </div>

      {dbUser?.isBlocked && <BlockedWarning />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 bg-base-100 rounded-2xl shadow-sm p-6 border border-base-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-base-content">
              Account Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                disabled={dbUser?.isBlocked}
                className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-base-content/50">
                    Account Type
                  </p>
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
              </div>
            </div>
          )}
        </div>

        {/* Premium Subscription */}
        <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden flex flex-col">
          <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                dbUser?.isPremium
                  ? "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-amber-900/40 dark:to-yellow-900/40 shadow-inner"
                  : "bg-base-300"
              }`}
            >
              <FiAward
                className={`text-4xl ${
                  dbUser?.isPremium
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-base-content/20"
                }`}
              />
            </div>

            <h3 className="text-2xl font-bold text-base-content mb-2">
              {dbUser?.isPremium
                ? "Premium Membership Active"
                : "Upgrade to Premium"}
            </h3>

            {dbUser?.isPremium ? (
              <div className="mt-4 w-full">
                <div className="inline-block px-4 py-2 bg-success/10 text-black dark:text-success border border-success/20 rounded-full font-semibold text-sm mb-6">
                  ✓ Active Plan
                </div>
                <div className="bg-base-200/50 rounded-xl p-5 text-left">
                  <h4 className="font-semibold text-base-content mb-3 text-sm uppercase tracking-wider">
                    Your Benefits
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Unlimited issue reporting",
                      "Priority support status",
                      "Faster resolution times",
                      "Advanced analytics access",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-base-content/80"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center text-xs">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-base-content/70 mb-6 max-w-xs mx-auto font-medium">
                  Get unlimited issue reporting and priority support for a
                  better city experience.
                </p>

                <div className="bg-primary/5 rounded-2xl p-6 mb-6 border border-primary/10">
                  <div className="flex items-end justify-center gap-1 mb-1">
                    <span className="text-4xl font-black text-primary tracking-tight">
                      ৳1000
                    </span>
                    <span className="text-base-content/50 font-medium mb-1.5">
                      / lifetime
                    </span>
                  </div>
                  <p className="text-xs text-center text-base-content/40 font-medium uppercase tracking-wide">
                    One-time payment
                  </p>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={paymentLoading || dbUser?.isBlocked}
                  className="w-full py-4 bg-linear-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 font-bold text-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {dbUser?.isBlocked
                    ? "Account Restricted"
                    : paymentLoading
                    ? "Processing..."
                    : "Subscribe Now"}
                </button>

                <div className="mt-8">
                  <h4 className="font-medium text-base-content mb-4 text-sm text-left px-1">
                    Included in Premium:
                  </h4>
                  <ul className="space-y-3 text-left">
                    {[
                      "Unlimited issue reporting",
                      "Priority support status",
                      "Faster resolution times",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-base-content/80 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                          ✓
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="mt-6 bg-base-100 rounded-2xl shadow-sm p-6 border border-base-200">
        <h2 className="text-xl font-semibold text-base-content mb-4">
          Payment History
        </h2>
        {payments.length === 0 ? (
          <p className="text-base-content/40">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-base-200 bg-base-200/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Purpose
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td className="py-4 px-6 text-base-content/80">
                      {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-6 text-base-content/80 capitalize">
                      {payment.purpose}
                    </td>
                    <td className="py-4 px-6 text-base-content font-medium">
                      ৳{payment.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success/10 text-success border border-success/20">
                        {payment.status || "Completed"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDownloadInvoice(payment._id)}
                        className="text-info hover:underline inline-flex items-center gap-1"
                      >
                        <FiDownload className="text-sm" /> Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CitizenProfile;