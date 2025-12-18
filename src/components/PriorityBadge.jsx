import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-800', label: 'High' },
    normal: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Normal' },
  };

  const config = priorityConfig[priority?.toLowerCase()] || priorityConfig.normal;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
