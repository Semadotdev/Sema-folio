"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export default function Preloader() {
  const { loaded, setPreloaderDone } = useContent();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded && minTimePassed) {
      setShow(false);
    }
  }, [loaded, minTimePassed]);

  useEffect(() => {
    if (!show) setPreloaderDone(true);
  }, [show, setPreloaderDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f0f0f]"
          role="status"
          aria-label="Loading"
        >
          <div className="relative flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-500/30"
                style={{
                  width: 160 + (i + 1) * 60,
                  height: 160 + (i + 1) * 60,
                  animation: `glow-ring 3s ease-out ${i * 1}s infinite`,
                  boxShadow: `0 0 ${20 + i * 15}px rgba(59, 130, 246, ${0.15 - i * 0.04})`,
                }}
              />
            ))}
            <motion.img
              src="/images/Semadotdev-logo.png"
              alt="Semadotdev"
              className="w-32 h-32 object-contain relative z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
