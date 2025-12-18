import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllIssues } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import IssueCard from "../components/IssueCard";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import {
  MdVerified,
  MdReport,
  MdExplore,
  MdCheckCircle,
  MdInbox,
  MdPhoneIphone,
  MdUpdate,
  MdVisibility,
  MdRocketLaunch,
  MdPersonAdd,
} from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();
  const { dbUser } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Improve Your Community,",
      subtitle: "One Report at a Time",
      description:
        "Report infrastructure issues in your area and help us build a better, safer environment for everyone.",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200",
      color: "from-primary to-blue-600",
    },
    {
      title: "Your Voice Matters,",
      subtitle: "Make it Count",
      description:
        "Join thousands of active citizens who are already making their neighborhoods cleaner and safer through direct reporting.",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200",
      color: "from-blue-600 to-indigo-700",
    },
    {
      title: "Fast Action,",
      subtitle: "Better Results",
      description:
        "Our staff is ready to review and resolve your reports with transparency and speed. Track every step of the fix.",
      image:
        "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?w=1200",
      color: "from-indigo-700 to-blue-800",
    },
  ];

  const { data: resolvedIssues } = useQuery({
    queryKey: ["issues", "resolved"],
    queryFn: () =>
      getAllIssues({ status: "resolved", limit: 6, sort: "newest" }),
    select: (data) => data.data?.data?.issues || [],
  });

  const handleReportIssue = () => {
    if (dbUser) {
      navigate("/dashboard/citizen/report");
    } else {
      navigate("/signup");
    }
  };

  const handleBrowseIssues = () => {
    navigate("/all-issues");
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
    pauseOnHover: false,
    afterChange: (current) => setCurrentSlide(current),
    customPaging: (i) => (
      <div
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          currentSlide === i ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
        }`}
      />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <main className="grow">
        {/* Hero Section - Slider */}
        <section className="relative w-full overflow-hidden">
          <style>{`
            .custom-dots {
              bottom: 30px !important;
              display: flex !important;
              justify-content: center;
              padding: 0;
              margin: 0;
              list-style: none;
            }
            .custom-dots li {
              margin: 0 6px !important;
              width: 12px !important;
              height: 12px;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .custom-dots li.slick-active {
              width: 32px !important;
            }
            .custom-dots li button:before {
              display: none;
            }
          `}</style>
          <div className="relative max-w-7xl mx-auto py-10 sm:py-20 px-4 sm:px-6 lg:px-8">
            <div className="relative h-125 sm:h-150 w-full overflow-hidden rounded-3xl shadow-2xl">
              <Slider {...settings} className="h-full">
                {slides.map((slide, index) => (
                  <div key={index} className="relative h-125 sm:h-150">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-5000 scale-110"
                      style={{ backgroundImage: `url("${slide.image}")` }}
                    >
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${slide.color} opacity-70`}
                      ></div>
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                      <AnimatePresence mode="wait">
                        {currentSlide === index && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col gap-6 max-w-4xl"
                          >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mx-auto text-white text-sm font-medium mb-2 border border-white/30">
                              <MdVerified className="text-base" />
                              <span>Trusted by thousands of citizens</span>
                            </div>

                            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                              {slide.title}
                              <br />
                              <span className="bg-linear-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                                {slide.subtitle}
                              </span>
                            </h1>

                            <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                              {slide.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReportIssue}
                                className="flex items-center justify-center gap-2 min-w-50 h-14 px-8 rounded-xl bg-white text-primary text-base font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl"
                              >
                                <MdReport className="text-xl" />
                                <span>Report an Issue</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBrowseIssues}
                                className="flex items-center justify-center gap-2 min-w-50 h-14 px-8 rounded-xl bg-white/10 backdrop-blur-sm text-white text-base font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
                              >
                                <MdExplore className="text-xl" />
                                <span>All Issues</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </Slider>

              {/* Overlay Grid Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 z-10 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Latest Resolved Issues */}
        <section
          className="w-full py-20 sm:py-28 bg-white dark:bg-slate-900"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-semibold mb-4">
                <MdCheckCircle className="text-base" />
                <span>Success Stories</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                Latest Resolved Issues
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See how our community is making a difference, one issue at a
                time
              </p>
            </div>
            {resolvedIssues && resolvedIssues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {resolvedIssues.map((issue) => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                  <MdInbox className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No resolved issues yet
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 sm:py-28 bg-linear-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                Powerful Features for a Better Community
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to report, track, and resolve public issues
                efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-blue-100 dark:from-primary/20 dark:to-blue-900/30 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdPhoneIphone className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Mobile-Friendly Reporting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Easily submit issues on the go from any device. Snap a
                  picture, add a description, and send.
                </p>
              </div>
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-blue-100 dark:from-primary/20 dark:to-blue-900/30 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdUpdate className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Real-Time Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Get live updates on the status of your reports, from
                  submission to resolution.
                </p>
              </div>
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-blue-100 dark:from-primary/20 dark:to-blue-900/30 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdVisibility className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Community Transparency
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  View all public reports on an interactive map and see what's
                  being fixed in your neighborhood.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="w-full py-20 sm:py-28 bg-linear-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Simple steps to make your community better
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-primary/30 via-primary to-primary/30"></div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Report an Issue
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                  Take a photo and describe the infrastructure problem you've
                  noticed in your community.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  We Review & Assign
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                  Our team reviews your report and assigns it to the appropriate
                  staff member for resolution.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Track Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                  Follow the progress of your report in real-time and get
                  notified when the issue is resolved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-linear-to-br from-primary via-blue-600 to-blue-700 text-white rounded-3xl p-12 sm:p-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6">
                  <MdRocketLaunch className="text-base" />
                  <span>Join thousands of active citizens</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
                  Ready to Make a Difference?
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Create an account to submit your first report, track its
                  progress, and help improve your community today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 min-w-50 h-14 px-8 rounded-xl bg-white text-primary text-base font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <MdPersonAdd className="text-xl" />
                    <span>Sign Up Now</span>
                  </Link>
                  <Link
                    to="/all-issues"
                    className="flex items-center justify-center gap-2 min-w-50 h-14 px-8 rounded-xl bg-white/10 backdrop-blur-sm text-white text-base font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    <span>Learn More</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
