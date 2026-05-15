"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

export default function About() {
  const { content } = useContent();
  return (
    <section id="about" className="py-24 px-6">
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
            <div className="aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/images/Semadotdev.jpg"
                alt="Jiro Luis Manalo"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
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
              <p key={i} className={`text-zinc-400 leading-relaxed ${i < content.about.paragraphs.length - 1 ? "mb-6" : "mb-8"}`}>
                {p}
              </p>
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
