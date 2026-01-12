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
      className="w-full px-6 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
      onClick={() => mutation.mutate()}
      disabled={disabled || mutation.isLoading}
    >
      {mutation.isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : buttonText}
    </button>
  );
};

export default StripePaymentButton;