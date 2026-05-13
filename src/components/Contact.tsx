"use client";

import { motion } from "framer-motion";

const socials = [
  { name: "GitHub", href: "https://github.com/Semadotdev" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jiro-luis-manalo-914752387/" },
  { name: "Facebook", href: "https://www.facebook.com/jiro.luis.manalo.2025" },
  { name: "Email", href: "mailto:jiroluis.bizz@gmail.com" },
  { name: "Phone", href: "tel:+639991810510" },
];

export default function Contact() {
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
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto">
            Have a project in mind? Let&apos;s work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow"
            >
              Send Message
            </button>
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
