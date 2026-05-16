"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import PasswordModal from "@/components/PasswordModal";
import AnimatedBackground from "@/components/AnimatedBackground";
import { marked } from "marked";

export default function Hero() {
  const { content, setPasswordPromptOpen } = useContent();
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) {
      setClickCount(0);
      setPasswordPromptOpen(true);
    } else {
      timerRef.current = setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 400 100 C 250 100, 150 250, 200 400 C 250 550, 400 500, 400 400 C 400 300, 550 250, 600 400 C 650 550, 550 700, 400 700"
          fill="none"
          stroke="url(#s-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="4 8"
          style={{
            animation: "draw-s 8s linear infinite",
          }}
        />
        <defs>
          <linearGradient id="s-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-500/30"
                style={{
                  width: 96 + (i + 1) * 40,
                  height: 96 + (i + 1) * 40,
                  animation: `glow-ring 3s ease-out ${i * 1}s infinite`,
                  boxShadow: `0 0 ${20 + i * 15}px rgba(59, 130, 246, ${0.15 - i * 0.04})`,
                }}
              />
            ))}
          </div>
          <img
            src="/images/Semadotdev-logo.png"
            alt="Semadotdev"
            onClick={handleLogoClick}
            className="w-24 h-24 mx-auto cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-105 active:scale-95 relative z-10"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-blue-400 font-mono text-sm mb-4 tracking-widest uppercase"
        >
          Welcome to my portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
        >
          <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
            {content.hero.line1}
          </span>
          <br />
          <span className="text-white">{content.hero.line2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
        >
          <span dangerouslySetInnerHTML={{ __html: marked.parseInline(content.hero.subtitle, { async: false }) }} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 hover:text-white transition-colors"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-zinc-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.a>
      </motion.div>

      <PasswordModal />
    </section>
  );
}
