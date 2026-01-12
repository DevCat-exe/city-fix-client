import { motion } from "motion/react";
import { useState } from "react";
import { MdError } from "react-icons/md";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  icon: Icon,
  error,
  touched,
  value,
  onChange,
  onBlur,
  disabled = false,
  helperText,
  className = "",
  ...props
}) => {
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${
            hasError
              ? "text-error"
              : "text-base-content/80"
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl ${
              hasError ? "text-error" : "text-base-content/40"
            }`}
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border transition-all ${
            Icon ? "pl-12" : "pl-4"
          } ${
            hasError
              ? "border-error bg-error/5 text-error placeholder:text-error/40 focus:ring-error/50"
              : "border-base-300 bg-base-200/50 text-base-content placeholder:text-base-content/40 focus:ring-primary/50 focus:border-primary"
          } focus:outline-none focus:ring-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...props}
        />
      </div>

      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <MdError />
          {error}
        </motion.p>
      )}

      {!hasError && helperText && (
        <p className="text-sm text-base-content/50">{helperText}</p>
      )}
    </div>
  );
};

const TextArea = ({
  label,
  name,
  placeholder,
  required = false,
  error,
  touched,
  value,
  onChange,
  onBlur,
  disabled = false,
  helperText,
  rows = 4,
  className = "",
  ...props
}) => {
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${
            hasError
              ? "text-error"
              : "text-base-content/80"
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border transition-all resize-vertical ${
          hasError
            ? "border-error bg-error/5 text-error placeholder:text-error/40 focus:ring-error/50"
            : "border-base-300 bg-base-200/50 text-base-content placeholder:text-base-content/40 focus:ring-primary/50 focus:border-primary"
        } focus:outline-none focus:ring-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        {...props}
      />

      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <MdError />
          {error}
        </motion.p>
      )}

      {!hasError && helperText && (
        <p className="text-sm text-base-content/50">{helperText}</p>
      )}
    </div>
  );
};

const Select = ({
  label,
  name,
  options = [],
  required = false,
  error,
  touched,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium ${
            hasError
              ? "text-error"
              : "text-base-content/80"
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-all ${
          hasError
            ? "border-error bg-error/5 text-error focus:ring-error/50"
            : "border-base-300 bg-base-200/50 text-base-content focus:ring-primary/50 focus:border-primary"
        } focus:outline-none focus:ring-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        {...props}
      >
        <option value="" disabled className="bg-base-100">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-base-100">
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <MdError />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const Checkbox = ({
  label,
  name,
  error,
  touched,
  checked,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  className = "",
  ...props
}) => {
  const hasError = error && touched;

  return (
    <div className={`${className}`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`mt-1 w-5 h-5 rounded border-2 transition-all ${
            hasError
              ? "border-error text-error focus:ring-error/50"
              : "border-base-300 bg-base-200 text-primary focus:ring-primary/50"
          } focus:outline-none focus:ring-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...props}
        />
        <span
          className={`text-sm leading-tight ${
            hasError
              ? "text-error"
              : "text-base-content/80"
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1 mt-1"
        >
          <MdError />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const FileUpload = ({
  label,
  name,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  accept = "image/*",
  helperText,
  className = "",
  ...props
}) => {
  const hasError = error && touched;
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
    onChange(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium ${
            hasError
              ? "text-error"
              : "text-base-content/80"
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 ${
            hasError
              ? "border-error bg-error/5 text-error file:bg-error hover:file:bg-error/90 focus:ring-error/50"
              : "border-base-300 bg-base-200/50 text-base-content focus:ring-primary/50 focus:border-primary"
          } focus:outline-none focus:ring-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...props}
        />

        {fileName && (
          <div className="mt-2 px-3 py-1 rounded-lg bg-success/10 text-success text-sm">
            📎 {fileName}
          </div>
        )}
      </div>

      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <MdError />
          {error}
        </motion.p>
      )}

      {!hasError && helperText && (
        <p className="text-sm text-base-content/50">{helperText}</p>
      )}
    </div>
  );
};

const FormSection = ({ title, description, children, className = "" }) => (
  <div className={`space-y-6 ${className}`}>
    {(title || description) && (
      <div>
        {title && (
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-base-content/60">{description}</p>
        )}
      </div>
    )}
    {children}
  </div>
);

// Component exports
export { FormField, TextArea, Select, Checkbox, FileUpload, FormSection };

export default FormField;