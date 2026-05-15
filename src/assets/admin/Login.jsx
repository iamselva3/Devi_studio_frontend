import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-400/5 dark:bg-zinc-900/50 p-10 rounded-[2.5rem] border border-black/5 dark:border-zinc-800 shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-10">
            <h1 className="text-3xl font-serif font-bold mb-2 uppercase">Admin Access</h1>
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Devi Studio Dashboard</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm rounded-xl text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 ml-1">Username</label>
            <input 
              type="text"
              className="w-full bg-black/5 dark:bg-black border border-black/10 dark:border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 dark:focus:border-white transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 ml-1">Password</label>
            <input 
              type="password"
              className="w-full bg-black/5 dark:bg-black border border-black/10 dark:border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 dark:focus:border-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-2xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 text-[10px] uppercase tracking-widest mt-4"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>

  );
};

export default Login;
