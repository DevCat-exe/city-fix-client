import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon, title, value, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
