"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export default function PasswordModal() {
  const { passwordPromptOpen, setPasswordPromptOpen, unlock } = useContent();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const openedAtRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  if (passwordPromptOpen && !openedAtRef.current) {
    openedAtRef.current = Date.now();
  } else if (!passwordPromptOpen) {
    openedAtRef.current = 0;
  }

  useEffect(() => {
    if (passwordPromptOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [passwordPromptOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await unlock(password);
    if (!ok) {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {passwordPromptOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (Date.now() - openedAtRef.current < 200) return;
            setPasswordPromptOpen(false);
          }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-80 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-6 shadow-2xl"
          >
            <p className="text-sm text-zinc-400 mb-1 text-center font-mono tracking-widest uppercase">
              Admin Access
            </p>
            <h3 className="text-lg font-semibold text-white mb-5 text-center">
              Enter Password
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full rounded-xl border bg-zinc-800/50 px-4 py-3 pr-12 text-sm text-white placeholder-zinc-500 outline-none transition-colors ${
                    error ? "border-red-500" : "border-zinc-700 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs text-center">Incorrect password</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordPromptOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
                >
                  Unlock
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
