import { motion } from "motion/react";

export const SkeletonCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.2,
              }}
            />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.4,
              }}
            />
          </div>
        </div>

        {/* Meta info skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.6,
              }}
            />
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.8,
              }}
            />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const IssueCardSkeleton = () => {
  return <SkeletonCard />;
};

export const SkeletonLoader = ({
  count = 1,
  className = "",
  card = SkeletonCard,
}) => {
  const CardComponent = card;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <CardComponent key={i} />
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* Header skeleton */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <div
            key={i}
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1,
              }}
            />
          </div>
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={colIndex}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (rowIndex * columns + colIndex) * 0.1,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const StatsCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm"
    >
      {/* Icon skeleton */}
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Value skeleton */}
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.2,
          }}
        />
      </div>

      {/* Label skeleton */}
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: 0.4,
          }}
        />
      </div>
    </motion.div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default {
  SkeletonCard,
  IssueCardSkeleton,
  SkeletonLoader,
  TableSkeleton,
  StatsCardSkeleton,
  DetailSkeleton,
};
