"use client";

import { useState, useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import ProjectModal from "./ProjectModal";
import ProjectHoverEffect from "./ProjectHoverEffect";
import { marked } from "marked";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  favicon?: string;
  readmeUrl?: string;
}

const defaultProjects: Project[] = [
  {
    title: "Luna AI",
    description: "A celestial-themed AI chat app with Supabase auth, streaming Groq API responses, voice input, file attachments, and constellation folders for session management.",
    tags: ["Groq AI", "Supabase", "Express", "Vanilla JS"],
    github: "https://github.com/Semadotdev/luna-ai",
    demo: "https://luna-ai-eight-woad.vercel.app",
    favicon: "/images/projects/luna-ai.png",
    readmeUrl: "https://raw.githubusercontent.com/Semadotdev/luna-ai/main/README.md",
  },
  {
    title: "Baktag",
    description: "A warehouse management system and baktag utility for ██████████████, designed to streamline inventory tracking and tag management.",
    tags: ["PHP", "MySQL", "WMS", "Inventory", "BarTender"],
    readmeUrl: "/projects/franklin-baker.md",
    favicon: "/images/favicon.png",
  },
  {
    title: "Quantinda",
    description: "A smart sari-sari store Inventory and POS system designed to simplify sales tracking, inventory management, and daily store operations.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "TanStack Query"],
    github: "https://github.com/Semadotdev/Quantinda",
    demo: "https://quantinda.vercel.app",
    favicon: "/images/projects/quantinda.png",
    readmeUrl: "https://raw.githubusercontent.com/Semadotdev/Quantinda/main/README.md",
  },
];

const defaultTitles = new Set(defaultProjects.map((p) => p.title));

function extractFirstParagraph(md: string): string {
  const lines = md.split("\n");
  const parts: string[] = [];
  let capturing = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (capturing) break;
      continue;
    }
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("___") ||
      trimmed.startsWith("[![")
    ) {
      if (capturing) break;
      continue;
    }
    capturing = true;
    parts.push(trimmed);
    if (parts.join(" ").length > 120) break;
  }

  return parts
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

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
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
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
      style={{ transformStyle: "preserve-3d" }}
      className="contents"
    >
      {children}
    </div>
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Projects() {
  const { userProjects } = useContent();
  const [selected, setSelected] = useState<Project | null>(null);
  const [projectList, setProjectList] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    for (const project of defaultProjects) {
      if (project.readmeUrl) {
        fetch(project.readmeUrl)
          .then((res) => res.text())
          .then((md) => {
            const desc = extractFirstParagraph(md);
            if (desc) {
              setProjectList((prev) =>
                prev.map((p) =>
                  p.title === project.title ? { ...p, description: desc } : p
                )
              );
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const allProjects = [...projectList, ...userProjects];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
            Featured Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            My{" "}
            <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
              Projects
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {allProjects.map((project) => {
            const isUserAdded = !defaultTitles.has(project.title);
            return (
              <motion.div
                key={project.title}
                variants={item}
              >
                <TiltCard>
                <div
                  onClick={() => setSelected(project)}
                  className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all hover:-translate-y-1 cursor-pointer"
                >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {!isUserAdded && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ProjectHoverEffect title={project.title} />
                  </div>
                )}
                <div className="relative z-10">
                  {project.favicon ? (
                    <img src={project.favicon} alt={`${project.title} icon`} className="w-10 h-10 rounded-lg mb-4 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 mb-4 flex items-center justify-center text-white font-bold text-sm">
                      {project.title[0]}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Source code"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Live demo"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: marked.parseInline(project.description, { async: false }) }} />
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  </div>
                </div>
                </TiltCard>
              </motion.div>
            );
          })}

          <motion.div
            variants={item}
            className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 opacity-60 ${allProjects.length % 2 === 0 ? "sm:col-span-2" : ""}`}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-800 mb-4 flex items-center justify-center text-zinc-500 text-sm">
              🚧
            </div>
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">Projects in Progress</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Actively developing new projects to expand the portfolio. Check back soon for updates!
            </p>
          </motion.div>
        </motion.div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
