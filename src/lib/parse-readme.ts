export type SectionType =
  | "features"
  | "techStack"
  | "quickStart"
  | "projectStructure"
  | "generic";

export interface ParsedSection {
  type: SectionType;
  title: string;
  content: string;
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
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";

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
      currentBody.push(line);
    }
  }

  if (started) {
    sections.push({
      type: detectSectionType(currentHeading),
      title: currentHeading,
      content: currentBody.join("\n").trim(),
    });
  }

  return sections;
}

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
