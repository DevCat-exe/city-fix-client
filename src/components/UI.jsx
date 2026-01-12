import { motion } from "motion/react";
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from "react-icons/md";

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
        bg: "bg-success/10",
        border: "border-success/20",
        text: "text-success-content",
        icon: MdCheckCircle,
        iconColor: "text-success",
      },
      error: {
        bg: "bg-error/10",
        border: "border-error/20",
        text: "text-error-content",
        icon: MdError,
        iconColor: "text-error",
      },
      warning: {
        bg: "bg-warning/10",
        border: "border-warning/20",
        text: "text-warning-content",
        icon: MdWarning,
        iconColor: "text-warning",
      },
      info: {
        bg: "bg-info/10",
        border: "border-info/20",
        text: "text-info-content",
        icon: MdInfo,
        iconColor: "text-info",
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
          <MdClose />
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
        <span className="text-base-content/60">
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
    green: "bg-success",
    yellow: "bg-warning",
    red: "bg-error",
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-base-content/60 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-base-200 overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`rounded-full transition-all duration-300 ${colorClasses[color] || "bg-primary"} ${sizeClasses[size]}`}
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
    default: "bg-base-200 text-base-content/70",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
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
