import React from 'react';
import { motion } from 'motion/react';

const StatsCard = ({ icon, title, value, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-info/10 text-info',
    green: 'bg-success/10 text-success',
    amber: 'bg-warning/10 text-warning',
    red: 'bg-error/10 text-error',
    purple: 'bg-secondary/10 text-secondary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-base-100 rounded-2xl p-6 border border-base-200 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-base-content/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-base-content">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-success' : 'text-error'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;