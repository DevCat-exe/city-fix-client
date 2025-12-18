import React from 'react';
import { format } from 'date-fns';

const Timeline = ({ entries = [] }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No timeline entries yet
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {entries.map((entry, idx) => (
          <li key={entry._id || idx}>
            <div className="relative pb-8">
              {idx !== entries.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{entry.status}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {entry.createdAt && format(new Date(entry.createdAt), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                  {entry.note && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{entry.note}</p>
                    </div>
                  )}
                  {entry.user && (
                    <div className="mt-1 text-xs text-gray-500">
                      By: {entry.user.name || entry.user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
