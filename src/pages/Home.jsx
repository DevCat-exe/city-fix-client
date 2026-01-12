import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllIssues } from "../api/endpoints";
import { useAuth } from "../hooks/useAuth";
import IssueCard from "../components/IssueCard";
import { SkeletonLoader } from "../components/Skeleton";
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
  MdTrendingUp,
  MdPeople,
  MdStar,
  MdEmail,
  MdHandshake,
  MdQuestionAnswer,
  MdNewspaper,
  MdExpandMore,
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

  const { data: resolvedIssues, isLoading: isLoadingResolved } = useQuery({
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
    <div className="min-h-screen bg-gradient-page">
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
            <div className="relative h-[500px] sm:h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl">
              <Slider {...settings} className="h-full">
                {slides.map((slide, index) => (
                  <div key={index} className="relative h-[500px] sm:h-[600px]">
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
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-semibold mb-4">
                <MdCheckCircle className="text-base" />
                <span>Success Stories</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                Latest Resolved Issues
              </h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                See how our community is making a difference, one issue at a
                time
              </p>
            </div>
            {isLoadingResolved ? (
              <SkeletonLoader count={6} className="lg:gap-8" />
            ) : resolvedIssues && resolvedIssues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {resolvedIssues.map((issue) => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 mb-4">
                  <MdInbox className="text-3xl text-base-content/20" />
                </div>
                <p className="text-base-content/40">
                  No resolved issues yet
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 sm:py-28 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                Powerful Features for a Better Community
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                Everything you need to report, track, and resolve public issues
                efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-base-100 border border-base-200 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdPhoneIphone className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  Mobile-Friendly Reporting
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  Easily submit issues on the go from any device. Snap a
                  picture, add a description, and send.
                </p>
              </div>
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-base-100 border border-base-200 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdUpdate className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  Real-Time Tracking
                </h3>
                <p className="text-base-content/60 leading-relaxed">
                  Get live updates on the status of your reports, from
                  submission to resolution.
                </p>
              </div>
              <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-base-100 border border-base-200 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <MdVisibility className="text-4xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  Community Transparency
                </h3>
                <p className="text-base-content/60 leading-relaxed">
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
          className="w-full py-20 sm:py-28 bg-gradient-hero"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                How It Works
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                Simple steps to make your community better
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-primary/20"></div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  Report an Issue
                </h3>
                <p className="text-base-content/60 leading-relaxed max-w-sm">
                  Take a photo and describe the infrastructure problem you've
                  noticed in your community.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  We Review & Assign
                </h3>
                <p className="text-base-content/60 leading-relaxed max-w-sm">
                  Our team reviews your report and assigns it to the appropriate
                  staff member for resolution.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center p-8">
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="text-3xl font-black">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-base-content">
                  Track Progress
                </h3>
                <p className="text-base-content/60 leading-relaxed max-w-sm">
                  Follow the progress of your report in real-time and get
                  notified when the issue is resolved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 sm:py-28 bg-gradient-hero">
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

        {/* Statistics Section */}
        <section
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                Impact in Numbers
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                See how we're making a difference in communities everywhere
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 mx-auto">
                  <MdTrendingUp className="text-3xl" />
                </div>
                <h3 className="text-3xl font-bold text-base-content mb-2">
                  15,234
                </h3>
                <p className="text-base-content/60">
                  Issues Resolved
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 text-success mb-4 mx-auto">
                  <MdPeople className="text-3xl" />
                </div>
                <h3 className="text-3xl font-bold text-base-content mb-2">
                  8,456
                </h3>
                <p className="text-base-content/60">
                  Active Citizens
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/10 text-warning mb-4 mx-auto">
                  <MdStar className="text-3xl" />
                </div>
                <h3 className="text-3xl font-bold text-base-content mb-2">
                  4.8
                </h3>
                <p className="text-base-content/60">User Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-info/10 text-info mb-4 mx-auto">
                  <MdCheckCircle className="text-3xl" />
                </div>
                <h3 className="text-3xl font-bold text-base-content mb-2">
                  92%
                </h3>
                <p className="text-base-content/60">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                What Our Users Say
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                Real stories from real citizens making a difference
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-base-100 border border-base-200 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <p className="text-base-content/60 mb-6 leading-relaxed">
                  "CityFix helped me report a broken streetlight in my
                  neighborhood. It was fixed within 48 hours! This platform
                  truly makes a difference."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-primary to-blue-600 flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      Jane Doe
                    </p>
                    <p className="text-sm text-base-content/50">
                      Concerned Citizen
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 rounded-2xl bg-base-100 border border-base-200 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <p className="text-base-content/60 mb-6 leading-relaxed">
                  "As a city council member, I appreciate how CityFix
                  streamlines the reporting process and helps us prioritize
                  issues effectively."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                    MS
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      Mark Smith
                    </p>
                    <p className="text-sm text-base-content/50">
                      City Council
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 rounded-2xl bg-base-100 border border-base-200 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <MdStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <p className="text-base-content/60 mb-6 leading-relaxed">
                  "The transparency and real-time updates keep me informed about
                  the issues I care about. Great work by the CityFix team!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    SJ
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      Sarah Johnson
                    </p>
                    <p className="text-sm text-base-content/50">
                      Community Leader
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-info/10 text-info text-sm font-semibold mb-4">
                <MdHandshake className="text-base" />
                <span>Trusted Partners</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                Working Together for Better Communities
              </h2>
              <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                We collaborate with leading organizations to maximize our impact
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="flex items-center justify-center p-6 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-base-content/20">CityGov</div>
              </div>
              <div className="flex items-center justify-center p-6 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-base-content/20">EcoWatch</div>
              </div>
              <div className="flex items-center justify-center p-6 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-base-content/20">
                  SafeStreets
                </div>
              </div>
              <div className="flex items-center justify-center p-6 rounded-xl bg-base-100 border border-base-200 hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-base-content/20">
                  GreenCity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Blog Posts Section */}
        <section
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-semibold mb-4">
                <MdNewspaper className="text-base" />
                <span>Latest News</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                From Our Blog
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                Tips, stories, and insights about community improvement
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="group rounded-2xl bg-base-100 border border-base-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-linear-to-r from-primary to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                      Infrastructure
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                    5 Ways to Improve Street Safety in Your Neighborhood
                  </h3>
                  <p className="text-base-content/60 mb-4 leading-relaxed">
                    Discover practical steps you can take to make your streets
                    safer for everyone.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/50">
                      3 days ago
                    </span>
                    <Link
                      to="/blog"
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
              <article className="group rounded-2xl bg-base-100 border border-base-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-linear-to-r from-green-500 to-green-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                      Success Story
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                    How Riverside Park Got Its Makeover
                  </h3>
                  <p className="text-base-content/60 mb-4 leading-relaxed">
                    Follow the journey of how community reports transformed a
                    neglected park into a vibrant space.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/50">
                      1 week ago
                    </span>
                    <Link
                      to="/blog"
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
              <article className="group rounded-2xl bg-base-100 border border-base-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-linear-to-r from-purple-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                      Guide
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                    The Complete Guide to Reporting Infrastructure Issues
                  </h3>
                  <p className="text-base-content/60 mb-4 leading-relaxed">
                    Learn how to write effective reports that get attention and
                    lead to quick resolutions.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/50">
                      2 weeks ago
                    </span>
                    <Link
                      to="/blog"
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="text-center mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-primary to-blue-600 text-white font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
              >
                <MdNewspaper className="text-xl" />
                View All Posts
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section
          className="w-full py-20 sm:py-28 bg-gradient-hero"
          data-aos="fade-up"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-semibold mb-4">
                <MdQuestionAnswer className="text-lg" />
                <span>Common Questions</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
                Get answers to common questions about CityFix
              </p>
            </div>
            <div className="space-y-4">
              <details className="group rounded-xl bg-base-100 border border-base-200 p-6 hover:shadow-lg transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-base-content">
                  How do I report an issue?
                  <MdExpandMore className="text-base-content/40 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-base-content/60 leading-relaxed">
                  Simply click on the "Report Issue" button, upload a photo,
                  provide a description, and submit. Our team will review and
                  assign it to the appropriate department.
                </p>
              </details>
              <details className="group rounded-xl bg-base-100 border border-base-200 p-6 hover:shadow-lg transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-base-content">
                  How long does it take to resolve issues?
                  <MdExpandMore className="text-base-content/40 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-base-content/60 leading-relaxed">
                  Resolution times vary depending on the issue type and
                  priority. Most issues are resolved within 2-7 days, while
                  urgent matters are addressed within 24 hours.
                </p>
              </details>
              <details className="group rounded-xl bg-base-100 border border-base-200 p-6 hover:shadow-lg transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-base-content">
                  Is CityFix free to use?
                  <MdExpandMore className="text-base-content/40 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-base-content/60 leading-relaxed">
                  Yes, CityFix is completely free for citizens. Premium features
                  are available for organizations that need advanced analytics
                  and reporting tools.
                </p>
              </details>
            </div>
            <div className="text-center mt-12">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
              >
                <MdQuestionAnswer className="text-xl" />
                View All FAQs
              </Link>
            </div>
          </div>
        </section>
        {/* Newsletter Section - Moved to Bottom and Reduced Height */}
        <section
          className="w-full py-12 sm:py-16 bg-gradient-hero border-t border-base-200"
          data-aos="fade-up"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <MdEmail className="text-base" />
                <span>Stay Updated</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-base-content mb-4 tracking-tight">
                Get the Latest Updates
              </h2>
              <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
                Subscribe to our newsletter and stay informed about our progress
                and new features
              </p>
            </div>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border border-base-300 bg-base-200 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-linear-to-r from-primary to-blue-600 text-white font-semibold hover:from-primary/90 hover:to-blue-600/90 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
