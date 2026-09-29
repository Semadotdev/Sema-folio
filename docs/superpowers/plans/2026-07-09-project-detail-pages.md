# Project Detail Pages with Bento Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/projects/[slug]` pages with a bento-grid layout that renders README sections as visual cards.

**Architecture:** Server component page at `src/app/projects/[slug]/page.tsx` fetches README markdown and parses it into typed sections (features, tech stack, quick start, project structure). Each section renders as a bento cell inside a responsive grid. The homepage Projects section cards navigate to these pages instead of opening a modal.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, Framer Motion, `marked` (already in project)

---

### Task 1: Create shared project manifest library

**Files:**
- Create: `src/lib/projects.ts`

- [ ] **Step 1: Create the manifest file**

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  favicon?: string;
  readmeUrl?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const defaultProjects: Project[] = [
  {
    title: "Luna AI",
    slug: "luna-ai",
    description:
      "A celestial-themed AI chat app with Supabase auth, streaming Groq API responses, voice input, file attachments, and constellation folders for session management.",
    tags: ["Groq AI", "Supabase", "Express", "Vanilla JS"],
    github: "https://github.com/Semadotdev/luna-ai",
    demo: "https://luna-ai-eight-woad.vercel.app",
    favicon: "/images/projects/luna-ai.png",
    readmeUrl: "/projects/luna-ai.md",
  },
  {
    title: "Baktag",
    slug: "baktag",
    description:
      "A warehouse management system and baktag utility for ██████████████, designed to streamline inventory tracking and tag management.",
    tags: ["PHP", "MySQL", "WMS", "Inventory", "BarTender"],
    readmeUrl: "/projects/franklin-baker.md",
    favicon: "/images/favicon.png",
  },
  {
    title: "Quantinda",
    slug: "quantinda",
    description:
      "A smart sari-sari store Inventory and POS system designed to simplify sales tracking, inventory management, and daily store operations.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "TanStack Query"],
    github: "https://github.com/Semadotdev/Quantinda",
    demo: "https://quantinda.vercel.app",
    favicon: "/images/projects/quantinda.png",
    readmeUrl: "/projects/quantinda.md",
  },
];

export const defaultTitles = new Set(defaultProjects.map((p) => p.title));

export function findProjectBySlug(slug: string): Project | undefined {
  return defaultProjects.find((p) => p.slug === slug);
}

export function extractFirstParagraph(md: string): string {
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
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit src/lib/projects.ts` (from project root)
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/projects.ts
git commit -m "feat: add shared project manifest library"
```

---

### Task 2: Build README section parser

**Files:**
- Create: `src/lib/parse-readme.ts`

- [ ] **Step 1: Create parser with typed sections**

```ts
export type SectionType =
  | "features"
  | "techStack"
  | "quickStart"
  | "projectStructure"
  | "generic";

export interface ParsedSection {
  type: SectionType;
  title: string;
  content: string; // raw markdown of the section body
}

const HEADING_PATTERNS: { type: SectionType; patterns: RegExp[] }[] = [
  {
    type: "features",
    patterns: [/^featu(?:re|res)/i, /^what you can do/i, /^capabilities/i],
  },
  {
    type: "techStack",
    patterns: [/^tech stack/i, /^stack/i, /^built with/i, /^technologies/i, /^technology/i],
  },
  {
    type: "quickStart",
    patterns: [/^quick start/i, /^getting started/i, /^setup/i, /^local setup/i, /^installation/i],
  },
  {
    type: "projectStructure",
    patterns: [/^project structure/i, /^structure/i, /^directory/i],
  },
];

function detectSectionType(heading: string): SectionType {
  const stripped = heading.replace(/[✨🚀★✧*#]/g, "").trim();
  for (const entry of HEADING_PATTERNS) {
    if (entry.patterns.some((p) => p.test(stripped))) {
      return entry.type;
    }
  }
  return "generic";
}

export function parseReadme(markdown: string): ParsedSection[] {
  // Extract H1 title
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Split by ## headings
  const sections: ParsedSection[] = [];
  const lines = markdown.split("\n");
  let currentHeading = "";
  let currentBody: string[] = [];
  let started = false;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (started) {
        sections.push({
          type: detectSectionType(currentHeading),
          title: currentHeading,
          content: currentBody.join("\n").trim(),
        });
      }
      currentHeading = line.replace(/^##\s+/, "").trim();
      currentBody = [];
      started = true;
    } else if (started) {
      // Skip the H1 title line and its content before first ##
      currentBody.push(line);
    }
  }

  // Push last section
  if (started) {
    sections.push({
      type: detectSectionType(currentHeading),
      title: currentHeading,
      content: currentBody.join("\n").trim(),
    });
  }

  return sections;
}

// --- Extraction helpers for bento cells ---

export function extractTable(md: string): { headers: string[]; rows: string[][] } | null {
  const tableRegex = /\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n)*)/;
  const match = md.match(tableRegex);
  if (!match) return null;
  const headers = match[1].split("|").map((h) => h.trim()).filter(Boolean);
  const rowLines = match[2].trim().split("\n");
  const rows = rowLines.map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );
  return { headers, rows };
}

export function extractListItems(md: string): string[] {
  const items: string[] = [];
  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    const match = trimmed.match(/^[-*+]\s+(.+)/);
    if (match) items.push(match[1].trim());
  }
  return items;
}

export function extractCodeBlock(md: string): string | null {
  const match = md.match(/```[\w]*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit src/lib/parse-readme.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/parse-readme.ts
git commit -m "feat: add README section parser"
```

---

### Task 3: Create bento grid components

**Files:**
- Create: `src/components/projects/BentoGrid.tsx`
- Create: `src/components/projects/BentoCell.tsx`
- Create: `src/components/projects/ProjectHero.tsx`
- Create: `src/components/projects/TechStackCell.tsx`
- Create: `src/components/projects/FeaturesCell.tsx`
- Create: `src/components/projects/QuickStartCell.tsx`
- Create: `src/components/projects/ProjectStructureCell.tsx`

- [ ] **Step 1: Create BentoCell wrapper**

```tsx
// src/components/projects/BentoCell.tsx
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  accent?: boolean;
}

export default function BentoCell({ children, className, title, accent = true }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 overflow-hidden",
        accent && "before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-blue-500/50 before:via-indigo-500/30 before:to-transparent",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
          <span className="text-xs text-blue-400 font-mono tracking-widest uppercase font-semibold">
            {title}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-blue-500/20 to-transparent" />
        </div>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create BentoGrid container**

```tsx
// src/components/projects/BentoGrid.tsx
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className }: Props) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5", className)}>
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";
```

- [ ] **Step 3: Create ProjectHero component**

```tsx
// src/components/projects/ProjectHero.tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
}

export default function ProjectHero({ project }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-10"
    >
      <div className="flex items-center gap-5 mb-5">
        {project.favicon ? (
          <div className="relative">
            <img
              src={project.favicon}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover relative z-10"
            />
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
            {project.title[0]}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {project.title}
          </h1>
          <div className="flex gap-4 mt-2">
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
      <p className="text-zinc-400 text-base leading-relaxed max-w-3xl">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Create TechStackCell**

```tsx
// src/components/projects/TechStackCell.tsx
interface Props {
  headers: string[];
  rows: string[][];
}

export default function TechStackCell({ headers, rows }: Props) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <span className="text-blue-400 text-xs font-mono tracking-wider uppercase font-semibold min-w-[80px]">
            {row[0] ?? ""}
          </span>
          <span className="text-zinc-300 text-sm text-right">
            {row[1] ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create FeaturesCell**

```tsx
// src/components/projects/FeaturesCell.tsx
interface Props {
  items: string[];
}

export default function FeaturesCell({ items }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
        >
          <span className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold mt-0.5 shrink-0">
            ✦
          </span>
          <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create QuickStartCell**

```tsx
// src/components/projects/QuickStartCell.tsx
export default function QuickStartCell({ steps }: { steps: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {steps.map((step, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
        >
          <span className="text-indigo-400 text-lg font-bold mr-2">{i + 1}.</span>
          <span className="text-zinc-300 text-sm">{step}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create ProjectStructureCell**

```tsx
// src/components/projects/ProjectStructureCell.tsx
export default function ProjectStructureCell({ tree }: { tree: string }) {
  return (
    <pre className="text-zinc-400 text-sm font-mono leading-relaxed overflow-x-auto">
      {tree}
    </pre>
  );
}
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 9: Commit**

```bash
git add src/components/projects/
git commit -m "feat: add bento grid components for project detail pages"
```

---

### Task 4: Create project detail page

**Files:**
- Create: `src/app/projects/layout.tsx`
- Create: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Create projects layout**

```tsx
// src/app/projects/layout.tsx
import type { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen pt-24 pb-16">{children}</div>;
}
```

- [ ] **Step 2: Create the project detail page**

```tsx
// src/app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { findProjectBySlug } from "@/lib/projects";
import { parseReadme, extractTable, extractListItems, extractCodeBlock } from "@/lib/parse-readme";
import type { ParsedSection } from "@/lib/parse-readme";
import fs from "fs";
import path from "path";
import BentoGrid from "@/components/projects/BentoGrid";
import BentoCell from "@/components/projects/BentoCell";
import ProjectHero from "@/components/projects/ProjectHero";
import TechStackCell from "@/components/projects/TechStackCell";
import FeaturesCell from "@/components/projects/FeaturesCell";
import QuickStartCell from "@/components/projects/QuickStartCell";
import ProjectStructureCell from "@/components/projects/ProjectStructureCell";

interface Props {
  params: Promise<{ slug: string }>;
}

function renderSection(section: ParsedSection, index: number) {
  switch (section.type) {
    case "techStack": {
      const table = extractTable(section.content);
      if (!table || table.rows.length === 0) return null;
      return (
        <div key={index} className="md:col-span-1 md:row-span-2">
          <BentoCell title="Tech Stack">
            <TechStackCell headers={table.headers} rows={table.rows} />
          </BentoCell>
        </div>
      );
    }
    case "features": {
      const items = extractListItems(section.content);
      if (items.length === 0) return null;
      return (
        <div key={index} className="md:col-span-1 md:row-span-2">
          <BentoCell title="Features">
            <FeaturesCell items={items} />
          </BentoCell>
        </div>
      );
    }
    case "quickStart":
    case "projectStructure":
      return null; // rendered separately below
    default:
      return null;
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) notFound();

  let sections: ParsedSection[] = [];

  if (project.readmeUrl) {
    try {
      const filePath = path.join(process.cwd(), "public", project.readmeUrl);
      const markdown = fs.readFileSync(filePath, "utf-8");
      sections = parseReadme(markdown);
    } catch {
      // README not found, render fallback
    }
  }

  const techStack = sections.find((s) => s.type === "techStack");
  const features = sections.find((s) => s.type === "features");
  const quickStart = sections.find((s) => s.type === "quickStart");
  const projectStructure = sections.find((s) => s.type === "projectStructure");

  return (
    <div className="max-w-5xl mx-auto px-6">
      <a
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </a>

      <ProjectHero project={project} />

      {sections.length > 0 ? (
        <BentoGrid>
          {/* Features + Tech Stack side by side */}
          {features && (
            <div className="md:col-span-1 md:row-span-2">
              <BentoCell title="Features">
                <FeaturesCell items={extractListItems(features.content)} />
              </BentoCell>
            </div>
          )}
          {techStack && (() => {
            const table = extractTable(techStack.content);
            if (!table) return null;
            return (
              <div className="md:col-span-1 md:row-span-2">
                <BentoCell title="Tech Stack">
                  <TechStackCell headers={table.headers} rows={table.rows} />
                </BentoCell>
              </div>
            );
          })()}

          {/* Quick Start - full width */}
          {quickStart && (() => {
            const items = extractListItems(quickStart.content);
            const steps = items.length > 0 ? items : [quickStart.content];
            return (
              <div className="md:col-span-2">
                <BentoCell title="Quick Start">
                  <QuickStartCell steps={steps} />
                </BentoCell>
              </div>
            );
          })()}

          {/* Project Structure - full width */}
          {projectStructure && (() => {
            const tree = extractCodeBlock(projectStructure.content);
            if (!tree) return null;
            return (
              <div className="md:col-span-2">
                <BentoCell title="Project Structure">
                  <ProjectStructureCell tree={tree} />
                </BentoCell>
              </div>
            );
          })()}

          {/* Remaining generic sections */}
          {sections
            .filter((s) => s.type === "generic")
            .map((section, i) => (
              <div key={`generic-${i}`} className="md:col-span-2">
                <BentoCell title={section.title}>
                  <RenderGeneric content={section.content} />
                </BentoCell>
              </div>
            ))}
        </BentoGrid>
      ) : (
        // Fallback for projects without README
        <div className="text-center py-16">
          <p className="text-zinc-500">No detailed documentation available for this project yet.</p>
        </div>
      )}
    </div>
  );
}

// Simple generic markdown renderer for non-categorized sections
function RenderGeneric({ content }: { content: string }) {
  const lines = content.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("```")) return null; // skip code fences
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          // Simple table row — render as text
          return (
            <p key={i} className="text-zinc-400 text-sm font-mono">
              {trimmed}
            </p>
          );
        }
        if (trimmed.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-blue-400/60 mt-1 shrink-0">•</span>
              <span className="text-zinc-300 text-sm">{trimmed.replace(/^- /, "")}</span>
            </div>
          );
        }
        if (/^\[!\[/.test(trimmed)) {
          // Deploy button image — skip
          return null;
        }
        return (
          <p key={i} className="text-zinc-400 text-sm leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/projects/
git commit -m "feat: add project detail pages with bento grid layout"
```

---

### Task 5: Update Projects.tsx to navigate to detail pages

**Files:**
- Modify: `src/components/Projects.tsx`

- [ ] **Step 1: Update imports and navigation logic**

Replace:
```tsx
import ProjectModal from "./ProjectModal";
```
with:
```tsx
import Link from "next/link";
```

Remove:
```tsx
import ProjectHoverEffect from "./ProjectHoverEffect";
import { marked } from "marked";
```

Remove the `extractFirstParagraph` function (moved to `src/lib/projects.ts`).

Update imports to use the shared manifest:
```tsx
import { defaultProjects, defaultTitles, extractFirstParagraph } from "@/lib/projects";
import type { Project } from "@/lib/projects";
```

Replace the card click handler:
```tsx
const [selected, setSelected] = useState<Project | null>(null);
```
Remove this state — we no longer need it.

Remove the `useEffect` that fetches README descriptions (the card will show the inline description from the manifest).

Replace the card's `onClick` div with a `Link`:
```tsx
<Link
  href={`/projects/${project.slug}`}
  className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all hover:-translate-y-1 cursor-pointer block"
>
```
And close the `</Link>` at the end.

Remove:
```tsx
<ProjectModal project={selected} onClose={() => setSelected(null)} />
```

Remove the `TiltCard` wrapper and the `container`/`item` Framer Motion variants — simplify to a clean grid.

- [ ] **Step 2: Write the updated component**

```tsx
"use client";

import { useContent } from "@/context/ContentContext";
import Link from "next/link";
import { defaultProjects, defaultTitles } from "@/lib/projects";
import ProjectHoverEffect from "./ProjectHoverEffect";
import { marked } from "marked";

export default function Projects() {
  const { userProjects } = useContent();
  const allProjects = [...defaultProjects, ...userProjects.map((p) => ({
    ...p,
    slug: p.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-"),
    readmeUrl: undefined,
  }))];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase mb-4">
            Featured Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            My{" "}
            <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
              Projects
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {allProjects.map((project) => {
            const isUserAdded = !defaultTitles.has(project.title);
            const hasDetailPage = !isUserAdded || project.readmeUrl;
            const cardContent = (
              <>
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
                        className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:scale-105 transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );

            return (
              <div key={project.title} className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all hover:-translate-y-1 cursor-pointer">
                {hasDetailPage ? (
                  <Link href={`/projects/${project.slug}`} className="block">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
            );
          })}

          <div
            className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 opacity-60 ${allProjects.length % 2 === 0 ? "sm:col-span-2" : ""}`}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-800 mb-4 flex items-center justify-center text-zinc-500 text-lg">
              🚧
            </div>
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">Projects in Progress</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Actively developing new projects to expand the portfolio. Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat: navigate to project detail pages instead of modal"
```

---

### Task 6: Update UserProject type in ContentContext

**Files:**
- Modify: `src/context/ContentContext.tsx`

- [ ] **Step 1: Add readmeUrl to UserProject interface**

```tsx
export interface UserProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  favicon?: string;
  readmeUrl?: string;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/context/ContentContext.tsx
git commit -m "feat: add readmeUrl field to UserProject type"
```

---

### Task 7: Create metadata generation for project pages

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx`

- [ ] **Step 1: Add generateMetadata function**

Add before the `ProjectPage` function:
```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/projects/[slug]/page.tsx
git commit -m "feat: add per-project metadata for SEO"
```
