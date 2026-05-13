"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Semadotdev. All rights reserved.
        </p>

        <motion.a
          href="#"
          whileHover={{ y: -2 }}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Back to top &uarr;
        </motion.a>
      </div>
    </footer>
  );
}
