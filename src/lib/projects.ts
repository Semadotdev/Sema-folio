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

export function slugify(text: string): string {
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
  {
    title: "E.M. Andor",
    slug: "em-andor",
    description:
      "A web platform for E.M. Andor Realty and Development — a public marketing site plus a role-gated back office for admins and sales agents, covering projects, lots, reservations, commission tracking, and ledger reporting, delivered as an installable PWA.",
    tags: ["React", "Vite", "Tailwind CSS", "Supabase", "PWA"],
    github: "https://github.com/Semadotdev/EM-Andor",
    demo: "https://em-andor.vercel.app",
    favicon: "/images/projects/em-andor.png",
    readmeUrl: "/projects/em-andor.md",
  },
  {
    title: "UNI-verse",
    slug: "uni-verse",
    description:
      "A fast, installable manga & manhwa reader with five content providers, a personal library with folders and share links, per-chapter read tracking, and offline image caching.",
    tags: ["Next.js", "TypeScript", "Prisma", "Supabase", "Tailwind CSS"],
    github: "https://github.com/Semadotdev/UNI-verse",
    demo: "https://uni-verse-six-gules.vercel.app",
    favicon: "/images/projects/uni-verse.png",
    readmeUrl: "/projects/uni-verse.md",
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
