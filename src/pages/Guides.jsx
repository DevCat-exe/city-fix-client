import React from "react";
import { motion } from "motion/react";
import {
  MdHelpOutline,
  MdReportProblem,
  MdTrackChanges,
  MdVerifiedUser,
  MdLightbulbOutline,
  MdSecurity,
  MdInfo,
} from "react-icons/md";

const Guides = () => {
  const guideSections = [
    {
      title: "Getting Started",
      icon: <MdHelpOutline className="text-3xl" />,
      color: "blue",
      steps: [
        {
          title: "Create an Account",
          description:
            "Sign up as a citizen to start reporting issues. It only takes a minute!",
        },
        {
          title: "Verify Your Email",
          description:
            "Ensure you can receive updates on your reports by verifying your email address.",
        },
        {
          title: "Set Up Your Profile",
          description:
            "Add a profile photo and accurate name to build trust within the community.",
        },
      ],
    },
    {
      title: "Reporting Issues",
      icon: <MdReportProblem className="text-3xl" />,
      color: "rose",
      steps: [
        {
          title: "Be Descriptive",
          description:
            "Provide a clear title and detailed description of the infrastructure problem.",
        },
        {
          title: "Add High-Quality Photos",
          description:
            "Images help staff understand the severity and exact location of the issue.",
        },
        {
          title: "Accurate Location",
          description:
            "Use the map or provide a precise address to help us find the issue quickly.",
        },
      ],
    },
    {
      title: "Tracking Progress",
      icon: <MdTrackChanges className="text-3xl" />,
      color: "teal",
      steps: [
        {
          title: "Monitor Status",
          description:
            "Check your dashboard to see if your report is 'Pending', 'In Progress', or 'Resolved'.",
        },
        {
          title: "Interact with Staff",
          description:
            "Provide additional feedback if requested by the assigned staff member.",
        },
        {
          title: "Get Notified",
          description:
            "Receive real-time updates as work progresses on your reported issues.",
        },
      ],
    },
    {
      title: "Premium Features",
      icon: <MdVerifiedUser className="text-3xl" />,
      color: "amber",
      steps: [
        {
          title: "Unlimited Reports",
          description:
            "Premium users can report an unlimited number of issues without any restrictions.",
        },
        {
          title: "Priority Handling",
          description:
            "Your reports move to the top of the queue for faster review and assignment.",
        },
        {
          title: "Advanced Statistics",
          description:
            "Access detailed analytics about issue resolution in your specific area.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            How CityFix Works
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about reporting, tracking, and resolving
            infrastructure issues in your city.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {guideSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all group"
            >
              <div
                className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                ${
                  section.color === "blue"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : ""
                }
                ${
                  section.color === "rose"
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    : ""
                }
                ${
                  section.color === "teal"
                    ? "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
                    : ""
                }
                ${
                  section.color === "amber"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    : ""
                }
              `}
              >
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.steps.map((step, sIdx) => (
                  <div key={sIdx} className="relative pl-8">
                    <span className="absolute left-0 top-1 text-xs font-black text-primary/50 dark:text-primary/30">
                      0{sIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 sm:p-12 border border-primary/10 dark:border-primary/20 text-center"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <MdLightbulbOutline className="text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pro Tip: Be the Guardian of Your Block
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            The most successful reports are those that include multiple photos
            from different angles and clear context about how the issue affects
            daily life in the community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdSecurity className="text-primary" /> Verified Safety
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdInfo className="text-primary" /> Clear Context
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Guides;
