import React from "react";
import { MdError } from "react-icons/md";

const BlockedWarning = () => {
  return (
    <div className="mb-6 bg-error/10 border-l-4 border-error p-4 rounded-r-xl shadow-sm">
      <div className="flex items-center gap-3">
        <MdError className="text-error text-2xl" />
        <div>
          <h3 className="text-sm font-bold text-error">
            Account Restricted
          </h3>
          <div className="mt-1 text-sm text-error/80">
            <p>
              Your account has been blocked by an administrator. You can still
              view issues, but you cannot report new ones or participate in
              community actions.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-error">
        <span>Contact support if you believe this is a mistake.</span>
      </div>
    </div>
  );
};

export default BlockedWarning;