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
import { motion } from "framer-motion";
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your account information
        </p>
      </div>

      {dbUser?.isBlocked && <BlockedWarning />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Account Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                disabled={dbUser?.isBlocked}
                className="px-4 py-2 text-[#137fec] hover:bg-blue-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account Type
                  </p>
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
              </div>
            </div>
          )}
        </div>

        {/* Premium Subscription */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                dbUser?.isPremium
                  ? "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 shadow-inner"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <FiAward
                className={`text-4xl ${
                  dbUser?.isPremium
                    ? "text-amber-500 dark:text-amber-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {dbUser?.isPremium
                ? "Premium Membership Active"
                : "Upgrade to Premium"}
            </h3>

            {dbUser?.isPremium ? (
              <div className="mt-4 w-full">
                <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-semibold text-sm mb-6">
                  ✓ Active Plan
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-5 text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
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
                        className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-200"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs">
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
                <p className="text-gray-800 dark:text-gray-200 mb-6 max-w-xs mx-auto font-medium">
                  Get unlimited issue reporting and priority support for a
                  better city experience.
                </p>

                <div className="bg-gradient-to-br from-[#137fec]/5 to-blue-50 dark:from-[#137fec]/10 dark:to-slate-700/50 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-end justify-center gap-1 mb-1">
                    <span className="text-4xl font-black text-[#137fec] tracking-tight">
                      ৳1000
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 font-medium mb-1.5">
                      / lifetime
                    </span>
                  </div>
                  <p className="text-xs text-center text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide">
                    One-time payment
                  </p>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={paymentLoading || dbUser?.isBlocked}
                  className="w-full py-4 bg-gradient-to-r from-[#137fec] to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 font-bold text-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {dbUser?.isBlocked
                    ? "Account Restricted"
                    : paymentLoading
                    ? "Processing..."
                    : "Subscribe Now"}
                </button>

                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm text-left px-1">
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
                        className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
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
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Payment History
        </h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Purpose
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                      {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300 capitalize">
                      {payment.purpose}
                    </td>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">
                      ৳{payment.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        {payment.status || "Completed"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDownloadInvoice(payment._id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
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
