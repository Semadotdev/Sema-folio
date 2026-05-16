"use client";

import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { useState, FormEvent } from "react";
import { marked } from "marked";

const socials = [
  { name: "GitHub", href: "https://github.com/Semadotdev" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jiro-luis-manalo-914752387/" },
  { name: "Facebook", href: "https://www.facebook.com/jiro.luis.manalo.2025" },
  { name: "Email", href: "mailto:jiroluis.bizz@gmail.com" },
  { name: "Phone", href: "tel:+639991810510" },
];

export default function Contact() {
  const { content } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Let&apos;s{" "}
            <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
              Connect
            </span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            <span dangerouslySetInnerHTML={{ __html: marked.parseInline(content.contact.tagline, { async: false }) }} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/20"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center"
                  >
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                    >
                      <path d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1.8, 2.2] }}
                    transition={{ duration: 1.2, delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute inset-0 rounded-full bg-green-400/10"
                  />
                </div>
                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                >
                  Message Sent!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-zinc-400 text-sm mt-2 text-center max-w-xs"
                >
                  Thanks for reaching out! I&apos;ll get back to you soon.
                </motion.p>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
                >
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                {status === "error" && (
                  <p className="text-red-400 text-sm">Please fill in all required fields.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-6"
          >
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors group"
              >
                <span className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center group-hover:border-blue-500/50 transition-colors text-sm">
                  {social.name[0]}
                </span>
                <span className="text-sm">{social.name}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
