import { useState } from "react";

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        await onSubmit(values);
        // Reset form on successful submission
        setValues(initialValues);
        setErrors({});
        setTouched({});
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate if touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0,
  };
};

// Common validation rules
export const validationRules = {
  required: (message = "This field is required") => (value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return message;
    }
    return "";
  },

  email: (message = "Please enter a valid email address") => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return "";
  },

  minLength: (min, message = `Must be at least ${min} characters`) => (value) => {
    if (value && value.length < min) {
      return message;
    }
    return "";
  },

  maxLength: (max, message = `Must be no more than ${max} characters`) => (value) => {
    if (value && value.length > max) {
      return message;
    }
    return "";
  },

  pattern: (regex, message = "Please enter a valid format") => (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return "";
  },

  password: (message = "Password must be at least 8 characters with letters, numbers, and special characters") => (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (value && !passwordRegex.test(value)) {
      return message;
    }
    return "";
  },

  passwordMatch: (passwordFieldName, message = "Passwords do not match") => (value, allValues) => {
    if (value && allValues[passwordFieldName] && value !== allValues[passwordFieldName]) {
      return message;
    }
    return "";
  },

  phone: (message = "Please enter a valid phone number") => (value) => {
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (value && !phoneRegex.test(value)) {
      return message;
    }
    return "";
  },

  url: (message = "Please enter a valid URL") => (value) => {
    try {
      if (value) {
        new URL(value);
      }
    } catch {
      return message;
    }
    return "";
  },

  numeric: (message = "Please enter a valid number") => (value) => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return "";
  },

  min: (min, message = `Value must be at least ${min}`) => (value) => {
    const num = Number(value);
    if (value && !isNaN(num) && num < min) {
      return message;
    }
    return "";
  },

  max: (max, message = `Value must be no more than ${max}`) => (value) => {
    const num = Number(value);
    if (value && !isNaN(num) && num > max) {
      return message;
    }
    return "";
  },

  fileSize: (maxSizeMB, message = `File size must be less than ${maxSizeMB}MB`) => (value) => {
    if (value && value.size && value.size > maxSizeMB * 1024 * 1024) {
      return message;
    }
    return "";
  },

  fileType: (allowedTypes, message = "Invalid file type") => (value) => {
    if (value && value.type && !allowedTypes.includes(value.type)) {
      return message;
    }
    return "";
  },
};

export default useFormValidation;