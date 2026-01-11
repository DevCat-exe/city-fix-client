import { motion } from "motion/react";
import { MdCheckCircle, MdError, MdWarning, MdInfo } from "react-icons/md";

const Alert = ({
  type = "info",
  message,
  title,
  className = "",
  dismissible = false,
  onDismiss,
}) => {
  const getTypeStyles = () => {
    const types = {
      success: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        icon: MdCheckCircle,
        iconColor: "text-green-600 dark:text-green-400",
      },
      error: {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-800 dark:text-red-200",
        icon: MdError,
        iconColor: "text-red-600 dark:text-red-400",
      },
      warning: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-800 dark:text-yellow-200",
        icon: MdWarning,
        iconColor: "text-yellow-600 dark:text-yellow-400",
      },
      info: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-800 dark:text-blue-200",
        icon: MdInfo,
        iconColor: "text-blue-600 dark:text-blue-400",
      },
    };

    return types[type] || types.info;
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border ${styles.bg} ${styles.border} ${className}`}
    >
      <Icon className={`flex-shrink-0 text-xl ${styles.iconColor} mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${styles.text} mb-1`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${styles.text}`}>
          {message}
        </p>
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded-lg ${styles.text} hover:opacity-70 transition-opacity`}
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

const SuccessMessage = ({ message, title = "Success!" }) => (
  <Alert type="success" message={message} title={title} />
);

const ErrorMessage = ({ message, title = "Error!" }) => (
  <Alert type="error" message={message} title={title} />
);

const WarningMessage = ({ message, title = "Warning!" }) => (
  <Alert type="warning" message={message} title={title} />
);

const InfoMessage = ({ message, title = "Information" }) => (
  <Alert type="info" message={message} title={title} />
);

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`}
      />
      {text && (
        <span className="text-gray-600 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  );
};

const ProgressBar = ({ 
  progress = 0, 
  color = "primary", 
  showPercentage = true,
  size = "md",
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    primary: "bg-primary",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${sizeClasses[size]}`}>
        <div
          className={`rounded-full transition-all duration-300 ${colorClasses[color]} ${sizeClasses[size]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    primary: "bg-primary/10 text-primary dark:bg-primary/20",
    success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export {
  Alert,
  SuccessMessage,
  ErrorMessage,
  WarningMessage,
  InfoMessage,
  LoadingSpinner,
  ProgressBar,
  Badge,
};

export default Alert;