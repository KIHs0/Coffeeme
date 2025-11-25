import React, { useState, useEffect } from "react";
import { motion, stagger } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";


export default function WelcomeScreen({ children }) {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticate, screenLoading } = useSelector(state => state.userReducers)
  const setls = () => {
    setStarted(true)

  }
  useEffect(() => {
    if (started) return;
    // let v = JSON.parse(localStorage.getItem("etac"))
    if (isAuthenticate && screenLoading) {
      if (isAuthenticate) return;
      navigate("/login");
    }
  }, [started]);

  if (JSON.parse(localStorage.getItem("etac"))) {
    return children
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6">
      {/* Logo / Title */}
      <motion.h1
        className=" text-2xl md:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ☕ Coffeeme
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-gray-400 text-center max-w-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Welcome to Coffeeme — your cozy place to chat, connect, and share
        moments over coffee ☕.
      </motion.p>

      {/* Get Started Button */}
      <motion.button
        onClick={setls}
        className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg transition"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        Get Started
      </motion.button>
    </div>
  );
}
