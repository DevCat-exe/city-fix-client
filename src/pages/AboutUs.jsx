import React from "react";
import { motion } from "motion/react";
import { MdInfo, MdGroup, MdTimeline, MdVerifiedUser } from "react-icons/md";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            About CityFix
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our mission is to bridge the gap between citizens and local
            authorities, creating a more transparent and efficient way to
            maintain our urban infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Vision
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              We imagine a world where every citizen is an active guardian of
              their city. By providing a seamless platform for reporting issues,
              we empower individuals to take ownership of their surroundings and
              ensure a better quality of life for everyone.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MdVerifiedUser />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Verified transparency in issue resolution
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MdTimeline />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Real-time progress tracking for every report
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1573164060897-425eba288849?w=800"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <MdGroup className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Community Driven
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built for the people, by people who care about their local
              infrastructure.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <MdTimeline className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Efficient Workflow
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Streamlined process from reporting to staff assignment and final
              fix.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-6">
              <MdInfo className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Always Improving
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We constantly update our platform based on citizen and staff
              feedback.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
