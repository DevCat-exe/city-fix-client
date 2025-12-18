import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "../api/endpoints";

const StripePaymentButton = ({
  amount,
  meta,
  buttonText = "Pay",
  disabled = false,
}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await createCheckoutSession({ amount, ...meta });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.data?.url) {
        window.location.href = data.data.url;
      }
    },
  });

  return (
    <button
      className="w-full px-6 py-3 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      onClick={() => mutation.mutate()}
      disabled={disabled || mutation.isLoading}
    >
      {mutation.isLoading ? "Processing..." : buttonText}
    </button>
  );
};

export default StripePaymentButton;
