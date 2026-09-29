"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import PasswordModal from "@/components/PasswordModal";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import Logo3D from "@/components/Logo3D";
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
      <InteractiveGridPattern
        className="[mask-image:radial-gradient(50%_50%_at_center,white_20%,transparent_70%)]"
        squares={[40, 40]}
        width={24}
        height={24}
      />

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
                  width: 160 + (i + 1) * 60,
                  height: 160 + (i + 1) * 60,
                  animation: `glow-ring 3s ease-out ${i * 1}s infinite`,
                  boxShadow: `0 0 ${20 + i * 15}px rgba(59, 130, 246, ${0.15 - i * 0.04})`,
                }}
              />
            ))}
          </div>
          <Logo3D onClick={handleLogoClick} />
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
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 hover:text-white active:scale-95 transition-all"
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
