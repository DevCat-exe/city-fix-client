import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { verifyToken } from "../../api/endpoints";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import {
  MdPublic,
  MdVisibility,
  MdPersonAdd,
  MdVerified,
  MdSecurity,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FiUpload, FiX } from "react-icons/fi";
import { uploadImage } from "../../api/endpoints";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Handle redirect result from Google Sign-In
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // Sync with backend
          const token = await result.user.getIdToken();
          localStorage.setItem("firebaseToken", token);
          await verifyToken(token);
          await refreshUser();
          toast.success("Account created successfully!");
          navigate("/");
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        if (error.code !== "auth/popup-closed-by-user") {
          toast.error(error.message || "Signup failed");
        }
      }
    };
    handleRedirectResult();
  }, [navigate, refreshUser]);
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
      // 1. Create Firebase user first
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2. Immediately set token in localStorage so subsequent API calls (upload, verify) are authorized
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("firebaseToken", token);

      // 3. Upload photo if selected (now authorized)
      let uploadedPhotoURL = "";
      if (photo) {
        setUploading(true);
        const uploadRes = await uploadImage(photo);
        uploadedPhotoURL = uploadRes.data?.data?.url || "";
      }

      // 4. Update Firebase profile with name and photo
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: uploadedPhotoURL,
      });

      // 5. Sync with backend database
      toast.loading("Setting up your account...", { id: loadingToast });
      await verifyToken(token);
      await refreshUser();

      toast.success("Account created successfully!", { id: loadingToast });
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Failed to create account";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use. Please login instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      } else if (error.response?.status === 401) {
        // Backend verification failed but Firebase user created
        errorMessage =
          "Account created but verification failed. Please try logging in.";
        navigate("/login");
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Sync with backend
        toast.loading("Setting up your account...");
        const token = await result.user.getIdToken();
        localStorage.setItem("firebaseToken", token);
        await verifyToken(token);
        await refreshUser();
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <div className="relative hidden md:flex md:w-1/2 flex-col items-start justify-end p-12 bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-white overflow-hidden">
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
              Join Our Community
            </h1>
            <p className="text-lg font-medium leading-relaxed text-white/90 max-w-md">
              Create an account to start reporting issues and help improve your
              city.
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
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="pb-4">
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </button>
                <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-sm transition-all bg-white dark:bg-slate-600 text-primary dark:text-white shadow-md">
                  Sign Up
                </button>
              </div>
            </div>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                Create Account
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Join thousands of active citizens
              </p>
            </div>
            <form onSubmit={handleSignup}>
              <div className="flex flex-col gap-4 py-3">
                <label className="flex flex-col w-full">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Full Name
                  </p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 placeholder:text-gray-500 dark:placeholder-slate-400 p-[15px] text-base font-normal leading-normal"
                    placeholder="Enter your full name"
                    required
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Profile Photo
                  </p>
                  <div className="flex items-center gap-4 py-2">
                    <div className="relative w-20 h-20 rounded-xl bg-gray-100 dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden group">
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhoto(null);
                              setPhotoPreview("");
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity z-10"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          <FiUpload className="text-gray-400 text-xl" />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="inline-flex px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        {photoPreview ? "Change Photo" : "Upload Photo"}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Optional but recommended
                      </p>
                      {uploading && (
                        <p className="text-xs text-primary mt-1 animate-pulse">
                          Uploading image...
                        </p>
                      )}
                    </div>
                  </div>
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Email
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 placeholder:text-gray-500 dark:placeholder-slate-400 p-[15px] text-base font-normal leading-normal"
                    placeholder="Enter your email"
                    required
                  />
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Password
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 placeholder:text-gray-500 dark:placeholder-slate-400 p-[15px] text-base font-normal leading-normal"
                      placeholder="Enter your password (min 6 characters)"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                    >
                      <MdVisibility className="text-xl" />
                    </button>
                  </div>
                </label>
                <label className="flex flex-col w-full">
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">
                    Confirm Password
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 h-14 placeholder:text-gray-500 dark:placeholder-slate-400 p-[15px] text-base font-normal leading-normal"
                      placeholder="Confirm your password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
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
                  className="flex items-center justify-center gap-2 w-full h-14 px-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white text-base font-bold hover:from-primary/90 hover:to-blue-600/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      <MdPersonAdd className="text-lg" />
                      <span>Sign Up</span>
                    </>
                  )}
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full h-14 px-4 rounded-xl bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 transition-all font-semibold"
                >
                  <FcGoogle className="w-6 h-6" />
                  <span>Continue with Google</span>
                </button>
              </div>
              <div className="pt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-primary hover:underline"
                  >
                    Login
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

export default Signup;
