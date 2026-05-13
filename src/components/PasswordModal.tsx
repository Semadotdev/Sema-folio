"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export default function PasswordModal() {
  const { passwordPromptOpen, setPasswordPromptOpen, unlock } = useContent();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          onClick={() => setPasswordPromptOpen(false)}
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
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full rounded-xl border bg-zinc-800/50 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors ${
                  error ? "border-red-500" : "border-zinc-700 focus:border-blue-500"
                }`}
              />
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
