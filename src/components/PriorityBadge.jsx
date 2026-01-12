import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { bg: 'bg-error/10', text: 'text-error', label: 'High' },
    normal: { bg: 'bg-base-300', text: 'text-base-content/60', label: 'Normal' },
  };

  const config = priorityConfig[priority?.toLowerCase()] || priorityConfig.normal;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border border-current/10 ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;