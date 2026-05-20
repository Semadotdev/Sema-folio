"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import { marked } from "marked";

export default function About() {
  const { content } = useContent();
  return (
    <section id="about" className="py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-blue-500/20"
                    style={{
                      width: 220 + (i + 1) * 80,
                      height: 220 + (i + 1) * 80,
                      animation: `glow-ring 3s ease-out ${i * 1}s infinite`,
                    }}
                  />
                ))}
              </motion.div>
              <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 animate-[gradient-shift_4s_ease_infinite] bg-[length:200%_auto]">
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#0f0f0f]">
                  <motion.div
                    initial={{ clipPath: "circle(0% at 50% 50%)" }}
                    whileInView={{ clipPath: "circle(100% at 50% 50%)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                  >
                    <Image
                      src="/images/Semadotdev.jpg"
                      alt="Jiro Luis Manalo"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
              About Me
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
                {content.about.heading}
              </span>
            </h2>
            {content.about.paragraphs.map((p, i) => (
              <p key={i} className={`text-zinc-400 leading-relaxed ${i < content.about.paragraphs.length - 1 ? "mb-6" : "mb-8"}`}
                dangerouslySetInnerHTML={{ __html: marked.parseInline(p, { async: false }) }}
              />
            ))}
            <div className="flex flex-wrap gap-4">
              {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-xs font-mono border border-zinc-700 text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
