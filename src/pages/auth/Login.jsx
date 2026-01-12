import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import {
  MdPublic,
  MdVisibility,
  MdLogin,
  MdVerified,
  MdSecurity,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Handle redirect result from Google Sign-In
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await refreshUser();
          toast.success("Logged in successfully!");
          navigate("/");
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        if (error.code !== "auth/popup-closed-by-user") {
          toast.error(error.message || "Login failed");
        }
      }
    };
    handleRedirectResult();
  }, [navigate, refreshUser]);

  const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await refreshUser();
      toast.success("Logged in successfully!", { id: loadingToast });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    const loadingToast = toast.loading(
      `Signing in as ${demoEmail.split("@")[0]}...`
    );

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      await refreshUser();
      toast.success("Logged in successfully!", { id: loadingToast });
      navigate("/");
    } catch (error) {
      console.error("Demo login error:", error);
      toast.error("Demo login failed. Please check credentials.", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await refreshUser();
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <div className="relative hidden md:flex md:w-1/2 flex-col items-start justify-end p-12 bg-linear-to-br from-primary via-blue-600 to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="City infrastructure"
              className="h-full w-full object-cover opacity-20"
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200"
            />
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <MdPublic className="text-white text-3xl" />
              </div>
              <div>
                <span className="text-2xl font-black">CityFix</span>
                <p className="text-xs text-white/80">Infrastructure Reports</p>
              </div>
            </Link>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Your Voice for a Better City
            </h1>
            <p className="text-lg font-medium leading-relaxed text-white/90 max-w-md">
              Report infrastructure issues and help improve our community.
              Together, we build better cities.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <MdVerified className="text-sm" />
                <span className="text-sm font-medium">Trusted Platform</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                <MdSecurity className="text-sm" />
                <span className="text-sm font-medium">Secure & Safe</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 sm:p-8">
            <div className="pb-4">
              <div className="flex bg-base-200 rounded-xl p-1 gap-1">
                <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all bg-base-100 text-primary shadow-md">
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all text-base-content/60 hover:text-base-content"
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-base-content mb-2 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-base-content/60">
                Sign in to continue to CityFix
              </p>
            </div>
            <form onSubmit={handleEmailLogin}>
              <div className="flex flex-col gap-4 py-3">
                <label className="flex flex-col w-full">
                  <p className="text-base-content font-medium pb-2">
                    Email
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-14 px-4 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 border border-base-300 bg-base-200 placeholder:text-base-content/40 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </label>
                <label className="flex flex-col w-full">
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-base-content font-medium">
                      Password
                    </p>
                    <Link
                      to="/forgot-password"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full min-h-14 px-4 rounded-lg text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 border border-base-300 bg-base-200 placeholder:text-base-content/40 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content"
                    >
                      <MdVisibility className="text-xl" />
                    </button>
                  </div>
                </label>
              </div>
              <div className="flex flex-col gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full h-14 px-4 rounded-xl bg-linear-to-r from-primary to-blue-600 text-white text-base font-bold hover:from-primary/90 hover:to-blue-600/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      <MdLogin className="text-lg" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-base-100 text-base-content/50">
                      Demo Access
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 px-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleDemoLogin("admin@cityfix.com", "Admin123!")
                    }
                    className="px-2 py-2 rounded-lg text-[10px] font-bold bg-error/10 text-error border border-error/20 hover:bg-error/20 transition-colors uppercase tracking-wider"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDemoLogin("staff1@cityfix.com", "Staff123!")
                    }
                    className="px-2 py-2 rounded-lg text-[10px] font-bold bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 transition-colors uppercase tracking-wider"
                  >
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDemoLogin("alex@email.com", "Citizen123!")
                    }
                    className="px-2 py-2 rounded-lg text-[10px] font-bold bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors uppercase tracking-wider"
                  >
                    Citizen
                  </button>
                </div>
                <div className="relative py-2 mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-200"></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-14 px-4 rounded-xl bg-base-100 text-base-content/70 border-2 border-base-300 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span>Continue with Google</span>
                </button>
              </div>
              <div className="pt-6 text-center">
                <p className="text-sm text-base-content/60">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;