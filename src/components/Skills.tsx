"use client";

import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.transition = "transform 0.4s ease-out";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export default function Skills() {
  const { content } = useContent();
  return (
    <section id="skills" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
            Skills & Technologies
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            My{" "}
            <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
              Tech Stack
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {content.skills.map((category) => (
            <motion.div key={category.title} variants={item}>
              <TiltCard>
                <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
