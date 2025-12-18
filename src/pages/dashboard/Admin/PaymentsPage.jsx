import React, { useState, useEffect } from "react";
import { getAllPayments, getInvoice } from "../../../api/endpoints";
import { format } from "date-fns";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const PaymentsPage = () => {
  const [filter, setFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const paymentsResponse = await getAllPayments({
          ...(filter !== "all" && { purpose: filter }),
        });
        const paymentsData =
          paymentsResponse?.data?.data?.items ||
          paymentsResponse?.data?.items ||
          [];
        setPayments(paymentsData);
      } catch (err) {
        toast.error(err.message || "Failed to fetch data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

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

  if (dataLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">View all payment transactions</p>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-linear-to-r from-green-500 to-green-600 rounded-2xl shadow-md p-6 mb-6 text-white border border-green-400/20">
        <h2 className="text-lg font-medium">Total Revenue</h2>
        <p className="text-4xl font-bold mt-2">৳{totalRevenue}</p>
        <p className="text-green-100 mt-1">
          From {payments.length} transactions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "boost", "premium"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === type
              ? "bg-[#137fec] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No payments found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Purpose</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {payment.userId?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.userId?.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ৳{payment.amount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.purpose === "premium"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          }`}
                      >
                        {payment.purpose?.charAt(0).toUpperCase() +
                          payment.purpose?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      {payment.createdAt &&
                        format(
                          new Date(payment.createdAt),
                          "MMM dd, yyyy hh:mm a"
                        )}
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
        </div>
      )}
    </motion.div>
  );
};

export default PaymentsPage;
