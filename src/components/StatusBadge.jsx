import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
    'in-progress': { bg: 'bg-info/10', text: 'text-info', label: 'In Progress' },
    working: { bg: 'bg-info/10', text: 'text-info', label: 'Working' },
    resolved: { bg: 'bg-success/10', text: 'text-success', label: 'Resolved' },
    closed: { bg: 'bg-base-300', text: 'text-base-content/60', label: 'Closed' },
    rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rejected' },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border border-current/10 ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;