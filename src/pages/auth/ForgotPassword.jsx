import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { MdEmail, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { FormField } from "../../components/Form";
import {
  useFormValidation,
  validationRules,
} from "../../hooks/useFormValidation";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validationConfig = {
    email: [
      validationRules.required("Email is required"),
      validationRules.email("Please enter a valid email address"),
    ],
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useFormValidation({ email: "" }, validationConfig);

  const handleResetPassword = async (formData) => {
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setEmailSent(true);
      toast.success("Password reset email sent!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      let errorMessage = "Failed to send reset email";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary mb-8 transition-colors"
        >
          <MdArrowBack className="text-xl" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="rounded-2xl bg-base-100 shadow-xl border border-base-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <MdEmail className="text-3xl text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-base-content mb-2">
              Forgot Password?
            </h1>
            <p className="text-base-content/60">
              No problem! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {!emailSent ? (
            <form
              onSubmit={(e) =>
                e.preventDefault() || handleSubmit(handleResetPassword)
              }
              className="space-y-6"
            >
              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                icon={MdEmail}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                required
                disabled={loading}
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-primary to-blue-600 text-white font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <MdEmail className="text-xl" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
                <MdCheckCircle className="text-3xl text-success" />
              </div>
              <h2 className="text-xl font-semibold text-base-content mb-2">
                Check Your Email
              </h2>
              <p className="text-base-content/60 mb-4">
                We've sent a password reset link to:
                <br />
                <span className="font-medium text-primary">{values.email}</span>
              </p>
              <p className="text-sm text-base-content/40">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </motion.div>
          )}

          {/* Additional Help */}
          {!emailSent && (
            <div className="pt-6 border-t border-base-200">
              <div className="text-center space-y-2">
                <p className="text-sm text-base-content/60">
                  Remember your password?
                </p>
                <Link
                  to="/login"
                  className="text-primary font-medium text-sm hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-base-content/60 mb-4">
            Still having trouble?
          </p>
          <div className="space-y-2">
            <Link
              to="/faq"
              className="block text-primary text-sm hover:underline"
            >
              Visit our FAQ
            </Link>
            <a
              href="mailto:support@cityfix.com"
              className="block text-primary text-sm hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;