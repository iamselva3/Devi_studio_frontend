import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });
    try {
      // Assuming a backend route will be created
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", email: "", phone: "", date: "", message: "" });
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Failed to send message. Please try again." });
    }
  };

  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT SIDE: INFO */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold italic mb-6 tracking-tighter uppercase">
              Let's Tell <br /> Your Story
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md font-light leading-relaxed">
              Every celebration is unique. We are here to capture the magic of yours. Fill out the form and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-xl shrink-0">
                📍
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Location</h3>
                <p className="font-serif italic text-xl">Vellore, Tamil Nadu</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Call Us</h3>
                <p className="font-serif italic text-xl">+91 9840767566</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-xl shrink-0">
                ✉️
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email</h3>
                <p className="font-serif italic text-xl">hello@devistudio.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-zinc-900/40 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/5 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 ml-1 font-bold">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-100 dark:bg-black/20 border border-black/5 dark:border-white/10 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 ml-1 font-bold">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-100 dark:bg-black/20 border border-black/5 dark:border-white/10 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 transition"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 ml-1 font-bold">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-100 dark:bg-black/20 border border-black/5 dark:border-white/10 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 transition"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 ml-1 font-bold">Event Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-zinc-100 dark:bg-black/20 border border-black/5 dark:border-white/10 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-3 ml-1 font-bold">Booking Details</label>
              <textarea 
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-zinc-100 dark:bg-black/20 border border-black/5 dark:border-white/10 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 transition resize-none"
                placeholder="Tell us about your event..."
              />
            </div>

            <button 
              type="submit"
              disabled={status.loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition shadow-xl text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {status.loading ? "Sending..." : "Request Booking"}
            </button>

            {status.success && (
              <p className="text-green-500 text-sm text-center font-bold">Message sent successfully!</p>
            )}
            {status.error && (
              <p className="text-red-500 text-sm text-center font-bold">{status.error}</p>
            )}
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
