import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    working: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Working' },
    resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
