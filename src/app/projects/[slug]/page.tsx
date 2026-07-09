import { notFound } from "next/navigation";
import { findProjectBySlug } from "@/lib/projects";
import {
  parseReadme,
  extractTable,
  extractListItems,
  extractCodeBlock,
} from "@/lib/parse-readme";
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </a>

      <ProjectHero project={project} />

      {sections.length > 0 ? (
        <BentoGrid>
          {features && (
            <div className="md:col-span-1 md:row-span-2">
              <BentoCell title="Features">
                <FeaturesCell items={extractListItems(features.content)} />
              </BentoCell>
            </div>
          )}
          {techStack &&
            (() => {
              const table = extractTable(techStack.content);
              if (!table) return null;
              return (
                <div className="md:col-span-1 md:row-span-2">
                  <BentoCell title="Tech Stack">
                    <TechStackCell rows={table.rows} />
                  </BentoCell>
                </div>
              );
            })()}

          {quickStart &&
            (() => {
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

          {projectStructure &&
            (() => {
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
        <div className="text-center py-16">
          <p className="text-zinc-500">
            No detailed documentation available for this project yet.
          </p>
        </div>
      )}
    </div>
  );
}

function RenderGeneric({ content }: { content: string }) {
  const lines = content.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("```")) return null;
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
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
              <span className="text-zinc-300 text-sm">
                {trimmed.replace(/^- /, "")}
              </span>
            </div>
          );
        }
        if (/^\[!\[/.test(trimmed)) {
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
