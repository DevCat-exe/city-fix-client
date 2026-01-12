import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  MdExpandMore,
  MdQuestionAnswer,
  MdSearch,
  MdHelp,
  MdReport,
  MdPerson,
  MdSecurity,
  MdSettings,
} from "react-icons/md";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("general");
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqData = [
    {
      id: "general",
      name: "General Questions",
      icon: MdHelp,
      color: "blue",
      questions: [
        {
          q: "What is CityFix and how does it work?",
          a: "CityFix is a community platform that allows citizens to report infrastructure issues in their neighborhoods. Users can submit reports with photos and descriptions, track the status of their reports, and see what issues are being resolved in their area. Our system connects concerned citizens with local authorities to ensure quick and efficient resolution of public infrastructure problems.",
        },
        {
          q: "Is CityFix free to use?",
          a: "Yes, CityFix is completely free for individual citizens. You can report issues, track their progress, and access all features without any cost. We also offer premium features for organizations and municipalities that need advanced analytics, bulk reporting capabilities, and priority support.",
        },
        {
          q: "Which cities and areas does CityFix cover?",
          a: "CityFix is currently available in over 50 cities across the country. We're constantly expanding to new areas. You can check if your location is covered by attempting to report an issue - if your address isn't recognized, you can request coverage in your area and we'll prioritize expansion based on demand.",
        },
        {
          q: "How long does it typically take to resolve an issue?",
          a: "Resolution times vary depending on the issue type, severity, and local resources. Minor issues like burned-out streetlights are typically resolved within 3-5 business days, while major infrastructure problems may take 2-4 weeks. Urgent safety issues are usually addressed within 24 hours. You can track the real-time status of your reports in your dashboard.",
        },
      ],
    },
    {
      id: "reporting",
      name: "Reporting Issues",
      icon: MdReport,
      color: "green",
      questions: [
        {
          q: "What types of issues can I report?",
          a: "You can report a wide range of infrastructure issues including: road damage (potholes, cracks), lighting problems (burned-out streetlights), sidewalk issues, park maintenance, garbage collection problems, water leaks, traffic signal malfunctions, public space cleanliness, and more. If it's public infrastructure, you can report it.",
        },
        {
          q: "How do I submit an effective report?",
          a: "To submit an effective report: 1) Take clear photos from multiple angles, 2) Provide a detailed description of the issue, 3) Include the exact location or use our map pin feature, 4) Specify when the issue occurs (if time-dependent), 5) Indicate the severity level. More detailed reports help us process and resolve issues faster.",
        },
        {
          q: "Can I report anonymously?",
          a: "Yes, you can choose to report anonymously, but we recommend creating an account for better tracking and follow-up. Account holders receive updates on their reports and can communicate directly with resolution teams. Anonymous reports are still processed with the same priority as regular reports.",
        },
        {
          q: "What happens after I submit a report?",
          a: "After submission, your report goes through our automated triage system to categorize and prioritize it. It's then assigned to the appropriate municipal department. You'll receive a confirmation with a tracking number and can monitor the progress through your dashboard. The assigned team will review, investigate, and resolve the issue.",
        },
      ],
    },
    {
      id: "account",
      name: "Account & Profile",
      icon: MdPerson,
      color: "purple",
      questions: [
        {
          q: "How do I create a CityFix account?",
          a: "Creating an account is simple and takes less than a minute. Click 'Sign Up' on our homepage, enter your email address and create a password, or use the quick Google/Facebook signup option. You'll receive a confirmation email - click the link to verify your account and start reporting immediately.",
        },
        {
          q: "Can I edit or delete my reports?",
          a: "Yes, you can edit or delete your own reports as long as they haven't been assigned to a resolution team yet. Go to 'My Reports' in your dashboard, find the report, and use the edit/delete options. Once a report is in progress, you'll need to contact support for changes to ensure proper tracking.",
        },
        {
          q: "How do I reset my password?",
          a: "Click 'Forgot Password' on the login page, enter your registered email address, and we'll send you a password reset link. The link expires after 24 hours for security reasons. If you don't receive the email, check your spam folder or contact our support team.",
        },
        {
          q: "Can I change my email address or profile information?",
          a: "Yes, you can update your profile information anytime. Go to Settings in your dashboard, where you can change your email, name, phone number, notification preferences, and other account details. For email changes, you'll need to verify the new email address before it becomes active.",
        },
      ],
    },
    {
      id: "technical",
      name: "Technical Support",
      icon: MdSettings,
      color: "orange",
      questions: [
        {
          q: "What browsers and devices are supported?",
          a: "CityFix works on all modern browsers including Chrome, Firefox, Safari, and Edge. Our mobile apps are available for both iOS (iPhone/iPad) and Android devices. We recommend keeping your browser updated for the best experience and security.",
        },
        {
          q: "Why isn't the map loading correctly?",
          a: "Map loading issues are usually caused by poor internet connection, browser cache problems, or disabled location services. Try: 1) Refreshing the page, 2) Clearing your browser cache, 3) Enabling location permissions, 4) Checking your internet connection. If problems persist, try using a different browser or our mobile app.",
        },
        {
          q: "How do I report a technical problem with the platform?",
          a: "If you encounter technical issues, please report them through our Help Center or email support@cityfix.com. Include details about what happened, your device/browser information, and screenshots if possible. Our technical team typically responds within 24 hours.",
        },
        {
          q: "Are my reports and data secure?",
          a: "Absolutely. We use industry-standard encryption (SSL/TLS) for all data transmission and storage. Your personal information is never shared with third parties without your consent. We comply with GDPR and other privacy regulations. Regular security audits and updates ensure your data remains protected.",
        },
      ],
    },
    {
      id: "safety",
      name: "Safety & Privacy",
      icon: MdSecurity,
      color: "red",
      questions: [
        {
          q: "Is it safe to report issues in my neighborhood?",
          a: "Yes, reporting is completely safe. You can choose to report anonymously if you have concerns about privacy. Your exact location is only shared with authorized municipal personnel, not the public. We take safety seriously and have measures in place to protect reporters from any potential retaliation.",
        },
        {
          q: "How do I report urgent or emergency situations?",
          a: "For emergencies requiring immediate attention (fires, accidents, crimes), please call your local emergency services (911 or equivalent) first. CityFix is designed for non-emergency infrastructure issues. If you report something that appears to be an emergency, we'll direct you to contact emergency services.",
        },
        {
          q: "What happens if someone falsely reports an issue?",
          a: "False reporting is taken seriously as it wastes municipal resources. We have verification systems in place, and repeated false reporting can result in account suspension. Reports are cross-referenced with municipal records, and field teams verify issues before taking action.",
        },
        {
          q: "How is my personal information used?",
          a: "Your personal information is used solely for account management, report processing, and communication about your reports. We never sell your data to third parties. You can review our full Privacy Policy for detailed information about data collection, usage, and your rights regarding your personal information.",
        },
      ],
    },
  ];

  const filteredCategories = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const toggleItem = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-info/10",
        text: "text-info",
      },
      green: {
        bg: "bg-success/10",
        text: "text-success",
      },
      purple: {
        bg: "bg-secondary/10",
        text: "text-secondary",
      },
      orange: {
        bg: "bg-warning/10",
        text: "text-warning",
      },
      red: {
        bg: "bg-error/10",
        text: "text-error",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-semibold mb-4">
            <MdQuestionAnswer className="text-base" />
            <span>Help Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
            Find answers to common questions about CityFix and how it works
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 text-xl" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-base-300 bg-base-200 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => {
            const colors = getColorClasses(category.color);
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + categoryIndex * 0.1,
                  ease: "easeOut",
                }}
                className="rounded-2xl bg-base-100 border border-base-200 shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-base-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}
                    >
                      <Icon className="text-xl" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-base-content">
                        {category.name}
                      </h2>
                      <p className="text-sm text-base-content/50">
                        {category.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <MdExpandMore
                    className={`text-2xl text-base-content/40 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Category Questions */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-base-200"
                  >
                    <div className="divide-y divide-base-200">
                      {category.questions.map((item, itemIndex) => {
                        const itemKey = `${category.id}-${itemIndex}`;
                        const isItemExpanded = expandedItems.has(itemKey);

                        return (
                          <details
                            key={itemIndex}
                            open={isItemExpanded}
                            onToggle={(e) => {
                              e.preventDefault();
                              toggleItem(category.id, itemIndex);
                            }}
                            className="group"
                          >
                            <summary className="px-6 py-4 cursor-pointer hover:bg-base-200/50 transition-colors list-none">
                              <div className="flex items-center justify-between">
                                <h3 className="text-left font-medium text-base-content pr-4">
                                  {item.q}
                                </h3>
                                <MdExpandMore
                                  className={`text-xl text-base-content/40 transition-transform flex-shrink-0 ${
                                    isItemExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </summary>
                            {isItemExpanded && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-6 pb-4"
                              >
                                <p className="text-base-content/70 leading-relaxed pl-6 border-l-4 border-primary/30">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </details>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-base-200 mb-6">
              <MdQuestionAnswer className="text-4xl text-base-content/20" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">
              No matching questions found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 rounded-xl bg-primary text-primary-content font-semibold hover:bg-primary/90 transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="mt-16 p-8 rounded-2xl bg-linear-to-r from-primary to-blue-600 text-white text-center shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@cityfix.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:bg-gray-50 transition-colors"
            >
              Email Support
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border-2 border-white/30 hover:bg-white/20 transition-colors"
            >
              Contact Form
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FAQ;