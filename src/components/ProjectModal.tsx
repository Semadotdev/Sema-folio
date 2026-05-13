"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface Props {
  project: Project | null;
  onClose: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 py-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className={`h-4 bg-zinc-800 rounded-full ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
          <div className="h-3 bg-zinc-800/50 rounded-full w-full" />
          <div className="h-3 bg-zinc-800/50 rounded-full w-5/6" />
        </div>
      ))}
    </div>
  );
}

function FallbackContent({ project }: { project: Project }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      {project.favicon ? (
        <img src={project.favicon} alt="" className="w-16 h-16 rounded-2xl mb-6" />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl mb-6">
          {project.title[0]}
        </div>
      )}
      <p className="text-zinc-400 leading-relaxed max-w-lg">{project.description}</p>
    </div>
  );
}

const headings: string[] = [];

interface TokenWithText {
  raw?: string;
  text?: string;
  tokens?: TokenWithText[];
}

function createRenderer() {
  headings.length = 0;
  const renderer = new marked.Renderer();

  renderer.heading = function ({ text, depth, tokens }) {
    const resolved = tokens.map((t: TokenWithText) => t.raw ?? t.text ?? "").join("");
    headings.push(resolved);
    const sizes: Record<number, string> = {
      1: "text-2xl",
      2: "text-xl text-blue-300",
      3: "text-base text-indigo-300",
    };
    return `<h${depth} class="${sizes[depth] ?? "text-sm text-white"} font-bold mt-8 mb-4">${text}</h${depth}>
      ${depth <= 2 ? `<div class="h-px bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-transparent mt-2 mb-4"></div>` : ""}`;
  };

  renderer.code = function ({ text, lang }) {
    const isFileTree = /^[├└│ ]{2,}/.test(text);
    if (isFileTree) {
      const lines = text.split("\n").filter(Boolean);
      const tree = lines.map((line) => {
        const indent = line.search(/[├└│]/);
        const cleaned = line.replace(/[├└│─ ]+/g, "").trim();
        if (!cleaned) return "";
        const isDir = cleaned.endsWith("/") || !cleaned.includes(".");
        return `<div class="flex items-center gap-2 py-0.5" style="padding-left: ${indent * 8}px">
          <span class="text-zinc-600">${isDir ? "📁" : "📄"}</span>
          <span class="text-zinc-300 text-xs font-mono">${cleaned}</span>
        </div>`;
      }).join("");
      return `<div class="rounded-xl border border-zinc-700 bg-zinc-900/80 p-4 my-4 font-mono text-sm">${tree}</div>`;
    }
    return `<div class="rounded-xl border border-zinc-700 bg-zinc-900/80 my-4 overflow-hidden shadow-inner">
      <div class="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
        <div class="flex gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
        </div>
        ${lang ? `<span class="text-xs text-zinc-500 ml-2">${lang}</span>` : ""}
      </div>
      <pre class="p-4 overflow-x-auto text-sm"><code class="text-zinc-300 font-mono">${text}</code></pre>
    </div>`;
  };

  renderer.list = function ({ items, ordered }) {
    const isFeatures = headings.some((h) => /features?|skills?|capabilities/i.test(h));
    if (isFeatures && !ordered) {
      const cards = items.map((item) => {
        const txt = item.tokens
          .filter((t) => t.type === "text" || t.type === "paragraph")
          .map((t: any) => (t.tokens ?? []).map((tt: any) => tt.raw ?? "").join(""))
          .join("");
        const clean = txt || item.raw.replace(/^-\s*/, "").trim();
        return clean ? `<div class="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
          <span class="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold mt-0.5 shrink-0">✦</span>
          <span class="text-zinc-300 text-sm leading-relaxed">${clean}</span>
        </div>` : "";
      }).join("");
      return `<div class="grid sm:grid-cols-2 gap-3 my-4">${cards}</div>`;
    }
    const tag = ordered ? "ol" : "ul";
    const listItems = items.map((item) => {
      const txt = item.tokens
        .filter((t) => t.type === "text")
        .map((t: any) => (t.tokens ?? []).map((tt: any) => tt.raw ?? "").join(""))
        .join("");
      const clean = txt || item.raw.replace(/^[-*+]\s*/, "").trim();
      return `<li class="text-zinc-400 text-sm leading-relaxed pl-1 marker:text-blue-400">${clean}</li>`;
    }).join("");
    return `<${tag} class="space-y-1.5 my-4 list-inside">${listItems}</${tag}>`;
  };

  renderer.table = function ({ header, rows }) {
    const heads = header.map((c) => c.text);
    const isTechStack =
      heads.some((h) => /layer/i.test(h)) && heads.some((h) => /technology|tech/i.test(h));
    const isSchema =
      heads.some((h) => /column|field|name/i.test(h)) && heads.some((h) => /type/i.test(h));

    if (isTechStack) {
      const cards = rows.map((row) => {
        const vals = row.map((c) => c.text);
        return `<div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-colors">
          <span class="text-blue-400 text-xs font-mono tracking-widest uppercase">${vals[0] ?? ""}</span>
          <p class="text-white text-base mt-2">${vals[1] ?? ""}</p>
        </div>`;
      }).join("");
      return `<div class="grid sm:grid-cols-2 gap-5 my-4">${cards}</div>`;
    }

    if (isSchema) {
      const label = headings.at(-1) ?? "";
      const cards = rows.map((row) => {
        const vals = row.map((c) => c.text);
        return `<div class="flex items-center justify-between gap-4 py-2 px-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
          <span class="text-white text-sm font-mono">${vals[0] ?? ""}</span>
          <span class="text-zinc-500 text-xs text-right">${vals[1] ?? ""}</span>
        </div>`;
      }).join("");
      return `<div class="rounded-xl border border-zinc-700 bg-zinc-900/50 my-4 overflow-hidden">
        <div class="px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-zinc-700">
          <span class="text-blue-300 text-xs font-mono font-semibold">${label}</span>
        </div>
        <div class="p-1">${cards}</div>
      </div>`;
    }

    const thead = header
      .map((c) => `<th class="border border-zinc-700 bg-zinc-800 px-3 py-2 text-left text-white text-xs font-semibold uppercase tracking-wider">${c.text}</th>`)
      .join("");
    const tbody = rows.map((row) =>
      `<tr class="border-b border-zinc-800 last:border-0">${row.map((c) => `<td class="px-3 py-2 text-zinc-400 text-sm">${c.text}</td>`).join("")}</tr>`
    ).join("");
    return `<div class="overflow-x-auto my-4 rounded-xl border border-zinc-800">
      <table class="w-full border-collapse"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    </div>`;
  };

  renderer.blockquote = function ({ text }) {
    return `<blockquote class="border-l-2 border-blue-500 pl-4 my-4 text-zinc-400 text-sm italic">${text}</blockquote>`;
  };

  renderer.paragraph = function ({ text }) {
    const trimmed = text.trim();
    if (!trimmed) return "";
    return `<p class="text-zinc-300 text-sm leading-relaxed my-3">${trimmed}</p>`;
  };

  renderer.hr = function () {
    return `<div class="h-px bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-transparent my-8"></div>`;
  };

  renderer.codespan = function ({ text }) {
    return `<code class="text-blue-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">${text}</code>`;
  };

  renderer.strong = function ({ text }) {
    return `<strong class="text-white font-semibold">${text}</strong>`;
  };

  renderer.link = function ({ href, text }) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-2 transition-colors">${text}</a>`;
  };

  renderer.image = function ({ href, text }) {
    return `<img src="${href}" alt="${text}" class="rounded-xl border border-zinc-800 my-4 w-full" />`;
  };

  return renderer;
}

export default function ProjectModal({ project, onClose }: Props) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    if (!project.readmeUrl) {
      setContent("");
      return;
    }
    setLoading(true);
    fetch(project.readmeUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.text();
      })
      .then((md) => {
        const renderer = createRenderer();
        const html = marked.parse(md, { async: false, renderer }) as string;
        setContent(html);
      })
      .catch(() => {
        setContent("");
      })
      .finally(() => setLoading(false));
  }, [project]);

  useEffect(() => {
    if (project) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-700/50 bg-zinc-900/95 shadow-2xl shadow-blue-500/5"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/3 to-transparent pointer-events-none" />

            <div className="sticky top-0 z-10 flex items-center justify-between p-6 pb-0 bg-zinc-900/95 backdrop-blur">
              <div className="flex items-center gap-4">
                {project.favicon ? (
                  <div className="relative">
                    <img src={project.favicon} alt="" className="w-12 h-12 rounded-xl object-cover relative z-10" />
                    <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-lg" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                    {project.title[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {project.title}
                  </h2>
                  <div className="flex gap-3 mt-1.5">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Source
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors text-xs"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>

            <div className="px-6 pt-6 pb-4">
              <div className="h-px bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-transparent" />
            </div>

            <div className="px-6 pb-6">
              {loading ? (
                <LoadingSkeleton />
              ) : content ? (
                <div
                  className="[&_*]:scrollbar-thin"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <FallbackContent project={project} />
              )}
            </div>

            <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 px-6 py-4 rounded-b-2xl">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
