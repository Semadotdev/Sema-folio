"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    role: "Bachelor of Science in Information Technology",
    company: "Pamantasan ng Lungsod ng San Pablo",
    period: "2022 - Present",
    description: "Pursuing a degree in IT with focus on software development, web technologies, and data science.",
  },
  {
    role: "Secondary Education",
    company: "St. Joseph School, San Pablo City",
    period: "2016 - 2022",
    description: "Completed secondary education with a strong foundation in science and mathematics.",
  },
  {
    role: "Elementary Education",
    company: "Alaminos Elementary School",
    period: "2010 - 2016",
    description: "Completed basic education with a focus on foundational learning.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0 },
};

export default function Timeline() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
            Education
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            My{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Academic Journey
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.role}
              variants={item}
              className={`relative pl-12 md:pl-0 md:w-1/2 ${
                index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
              } mb-12 last:mb-0`}
            >
              <div className={`absolute left-4 md:left-auto w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 ${
                index % 2 === 0 ? "md:right-[-6.5px]" : "md:left-[-6.5px]"
              } top-1`} />

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors">
                <span className="text-xs text-blue-400 font-mono">{exp.period}</span>
                <h3 className="text-lg font-semibold text-white mt-1">{exp.role}</h3>
                <p className="text-sm text-indigo-400 mb-2">{exp.company}</p>
                <p className="text-sm text-zinc-400 leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
