import React, { useState } from "react";
import { motion } from "motion/react";
import { MdEmail, MdPhone, MdLocationOn, MdSend } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-base-200/50">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-base-content mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MdEmail className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content mb-1">
                  Email Us
                </h3>
                <p className="text-base-content/60">
                  support@cityfix.com
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MdPhone className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content mb-1">
                  Call Us
                </h3>
                <p className="text-base-content/60">
                  +880 1234 567 890
                </p>
                <p className="text-base-content/60">
                  Mon-Fri from 9am to 6pm
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MdLocationOn className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content mb-1">
                  Our Office
                </h3>
                <p className="text-base-content/60">
                  123 CityFix Tower, Gulshan Ave
                </p>
                <p className="text-base-content/60">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-base-300">
              <h4 className="text-lg font-bold text-base-content mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 hover:bg-primary hover:text-white transition-all"
                >
                  <FaFacebook />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 hover:bg-primary hover:text-white transition-all"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 hover:bg-primary hover:text-white transition-all"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-base-100 rounded-3xl p-8 shadow-xl border border-base-200"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-base-300 bg-base-200 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-content font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MdSend />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;