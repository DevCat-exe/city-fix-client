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
    return <div className="text-center py-8 text-base-content/60">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Payments</h1>
        <p className="text-base-content/60 mt-1">View all payment transactions</p>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-success text-white rounded-2xl shadow-md p-6 mb-6 border border-success/20">
        <h2 className="text-lg font-medium opacity-90">Total Revenue</h2>
        <p className="text-4xl font-bold mt-2">৳{totalRevenue}</p>
        <p className="mt-1 opacity-80">
          From {payments.length} transactions
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "boost", "premium"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === type
              ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
              : "bg-base-100 text-base-content/70 border border-base-300 hover:bg-base-200"
              }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-base-100 rounded-2xl p-8 text-center border border-base-200 shadow-sm">
          <p className="text-base-content/40">No payments found</p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-base-200 bg-base-200/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">Purpose</th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-base-200 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-base-content mb-1">
                        {payment.userId?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-base-content/50">
                        {payment.userId?.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-base-content">
                        ৳{payment.amount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.purpose === "premium"
                          ? "bg-warning/20 text-warning-content"
                          : "bg-info/20 text-info"
                          }`}
                      >
                        {payment.purpose?.charAt(0).toUpperCase() +
                          payment.purpose?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-base-content/50">
                      {payment.createdAt &&
                        format(
                          new Date(payment.createdAt),
                          "MMM dd, yyyy hh:mm a"
                        )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-success/20 text-success">
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
        </div>
      )}
    </motion.div>
  );
};

export default PaymentsPage;