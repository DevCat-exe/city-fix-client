import React from "react";
import { MdReport, MdEmail } from "react-icons/md";

const BlockedWarning = () => {
  return (
    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
      <div className="flex items-start">
        <div className="shrink-0">
          <MdReport className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
            Account Blocked
          </h3>
          <div className="mt-1 text-sm text-red-700 dark:text-red-400">
            <p>
              Your account has been restricted by the administration. You can
              still view existing issues, but you are unable to report new
              issues, upvote, or perform other interactive actions at this time.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-800 dark:text-red-300">
            <MdEmail />
            <span>
              Please contact the authorities at{" "}
              <a href="mailto:admin@cityfix.com" className="underline">
                admin@cityfix.com
              </a>{" "}
              for more information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedWarning;
